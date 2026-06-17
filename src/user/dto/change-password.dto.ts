import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MaxLength(50)  
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The new password must have an Uppercase, lowercase letter and a number'
  }
  )
  newPassword: string;
}
