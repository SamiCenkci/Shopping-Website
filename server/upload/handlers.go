package upload

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	Region    string
	AccessKey string
	SecretKey string
	Bucket    string
}

type presignRequest struct {
	FileName    string `json:"file_name" binding:"required"`
	ContentType string `json:"content_type" binding:"required"`
}

// POST /api/uploads/presign  (protected)
// Returns a temporary URL the browser can PUT an image to,
// plus the final public URL where it will live.
func (h *Handler) Presign(c *gin.Context) {
	var req presignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build an S3 client using our credentials
	cfg, err := awscfg.LoadDefaultConfig(context.Background(),
		awscfg.WithRegion(h.Region),
		awscfg.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(h.AccessKey, h.SecretKey, ""),
		),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "aws config failed"})
		return
	}

	client := s3.NewFromConfig(cfg)
	presigner := s3.NewPresignClient(client)

	// Give the file a unique name so uploads never collide
	key := fmt.Sprintf("listings/%s-%s", uuid.New().String(), req.FileName)

	// Create a presigned PUT URL, valid for 5 minutes
	presigned, err := presigner.PresignPutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      aws.String(h.Bucket),
		Key:         aws.String(key),
		ContentType: aws.String(req.ContentType),
	}, s3.WithPresignExpires(5*time.Minute))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// The permanent public URL after upload
	publicURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", h.Bucket, h.Region, key)

	c.JSON(http.StatusOK, gin.H{
		"upload_url": presigned.URL, // browser PUTs the file here
		"public_url": publicURL,     // save this in the database
	})
}
