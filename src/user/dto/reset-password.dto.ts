import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class resetPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The new password must have an Uppercase, lowercase letter and a number'
  }
  )
  newPassword: string;

  @IsString()
  isTokenValid: string;
}