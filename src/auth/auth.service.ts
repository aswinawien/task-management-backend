import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {

    }

    signUp(authCredentialDTO: AuthCredentialDTO): Promise<void> {
        return this.userRepository.signUp(authCredentialDTO)
    }

    async signIn(authCredentialDTO: AuthCredentialDTO): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialDTO);

        if (!username) {
            throw new UnauthorizedException("Invalid Credentials")
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return {
            accessToken
        }
    }
}

