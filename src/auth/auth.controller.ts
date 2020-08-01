import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')

@ApiTags("Auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) {

    }


    @ApiBody({ type: AuthCredentialDTO })
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialDTO: AuthCredentialDTO): Promise<void> {
        return this.authService.signUp(authCredentialDTO)
    }


    @ApiBody({ type: AuthCredentialDTO })
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialDTO: AuthCredentialDTO): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialDTO)
    }
}
