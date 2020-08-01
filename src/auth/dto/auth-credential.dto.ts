import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialDTO {
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too weak : Password should have at least one uppercase letter and includes at least one number or one special characters!' }
    )
    password: string;
}