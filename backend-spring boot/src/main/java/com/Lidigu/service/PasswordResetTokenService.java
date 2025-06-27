package com.Lidigu.service;

import com.Lidigu.model.PasswordResetToken;

public interface PasswordResetTokenService {

	 PasswordResetToken findByToken(String token);

	 void delete(PasswordResetToken resetToken);

}
