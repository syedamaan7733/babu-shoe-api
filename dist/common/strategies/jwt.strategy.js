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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = require("../../Models/user.model");
const mongoose_2 = require("mongoose");
const token_models_1 = require("../../Models/token.models");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    userModel;
    tokenLogService;
    constructor(userModel, tokenLogService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                JwtStrategy_1.extractJwtFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
        this.userModel = userModel;
        this.tokenLogService = tokenLogService;
    }
    static extractJwtFromCookie(req) {
        const cookie_crum = req.cookies.access_token?.split('');
        console.log('Cookies received:', cookie_crum
            .slice(cookie_crum.length - 1 - 5, cookie_crum.length - 1)
            .join(''));
        return req.cookies?.access_token || null;
    }
    async validate(req, payload) {
        const token = req.cookies?.access_token;
        if (!token || !(await this.tokenLogService.isTokenvalid(token))) {
            throw new common_1.UnauthorizedException('Invalid or expired Token');
        }
        const user = await this.userModel.findById(payload.sub);
        if (!user)
            throw new common_1.UnauthorizedException('Unauthorized Token');
        console.log(`For: ${user.name} Role: ${user.role} From: ${req?.rawHeaders[9]}`);
        console.log(user);
        return {
            userId: payload.sub,
            name: user.name,
            phoneNumber: payload.phoneNumber,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        token_models_1.TokenLogService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map