import api from "../Utils/api"

/**
 * Send email verification OTP
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const sendEmailVerificationOTP = async (email) => {
  try {
    const response = await api.post("/auth/send-verification-otp", { email })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send verification code",
    }
  }
}

/**
 * Verify email with OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} - API response
 */
export const verifyEmailOTP = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-email-otp", { email, otp })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Invalid verification code",
    }
  }
}

/**
 * Change user email
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise} - API response
 */
export const changeEmail = async (newEmail, password) => {
  try {
    const response = await api.post("/auth/change-email", {
      newEmail,
      currentPassword: password,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to change email",
    }
  }
}

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to change password",
    }
  }
}

/**
 * Send forgot password email
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const sendForgotPasswordEmail = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send reset email",
    }
  }
}

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reset password",
    }
  }
}
