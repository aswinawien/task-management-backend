import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserEntity } from "./user.entity";
import { AuthCredentialDTO } from "./dto/auth-credential.dto";


@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

    async signUp(authCredentialDTO: AuthCredentialDTO): Promise<void> {
        const { username, password } = authCredentialDTO;
        const user = new UserEntity();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await this.save(user)
        } catch (error) {
            if (error.code == 23505) { // duplicated username
                throw new ConflictException('Username is already existed')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async validateUserPassword(authCredentialDTO: AuthCredentialDTO): Promise<string> {
        const { username, password } = authCredentialDTO;
        const user = await this.findOne({ username });
        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null
        }
    }
}