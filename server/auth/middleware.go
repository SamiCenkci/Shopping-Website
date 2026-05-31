package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// RequireAuth is a gatekeeper. It checks for a valid JWT in the
// Authorization header. If valid, it lets the request through and
// attaches the user's ID. If not, it rejects with 401 Unauthorized.
func RequireAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Expect header: "Authorization: Bearer <token>"
		header := c.GetHeader("Authorization")
		if header == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			c.Abort()
			return
		}

		// Split "Bearer <token>" into two parts
		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization format"})
			c.Abort()
			return
		}

		// Verify the token and pull out the user ID
		userID, err := ParseToken(parts[1], jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		// Stash the user ID so later handlers can read it
		c.Set("userID", userID)
		c.Next()
	}
}
