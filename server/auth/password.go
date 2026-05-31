package auth

import "golang.org/x/crypto/bcrypt"

// HashPassword scrambles a plain password into a safe-to-store hash.
func HashPassword(plain string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword returns true if the plain password matches the stored hash.
func CheckPassword(plain, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
	return err == nil
}
