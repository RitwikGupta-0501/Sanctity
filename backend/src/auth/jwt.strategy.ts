// Defines the JWT authentication strategy for Passport.js.
// This strategy extracts the JWT from the request and validates it.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service'; // Import AuthService to validate user

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService, // Inject AuthService
  ) {
    // Retrieve JWT_SECRET and ensure it's a string
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Do not ignore token expiration
      secretOrKey: jwtSecret, // Use the now-guaranteed string secret
    });
  }

  /**
   * Validates the JWT payload and returns the user.
   * This method is called after the token is extracted and verified.
   * @param payload The decoded JWT payload.
   * @returns The validated user object.
   */
  async validate(payload: any) {
    // 'payload' contains the data you signed into the JWT (e.g., { userId, username, email })
    const user = await this.authService.validateUser(payload); // Use AuthService to find and validate the user

    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Attach the user object to the request (req.user)
  }
}