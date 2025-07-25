"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Comment = class Comment {
    id;
    content;
    created_at;
    updated_at;
    deleted_at;
    author;
    authorId;
    parent;
    parentId;
    children;
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Comment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: null, nullable: true }),
    __metadata("design:type", Object)
], Comment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: null, nullable: true }),
    __metadata("design:type", Object)
], Comment.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.comments, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Comment.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.RelationId)((comment) => comment.author),
    __metadata("design:type", String)
], Comment.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", Comment)
], Comment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.RelationId)((comment) => comment.parent),
    __metadata("design:type", Object)
], Comment.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)({ cascade: true }),
    __metadata("design:type", Array)
], Comment.prototype, "children", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)('comments'),
    (0, typeorm_1.Tree)('closure-table')
], Comment);
//# sourceMappingURL=comment.entity.js.map