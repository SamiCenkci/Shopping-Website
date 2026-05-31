-- name: AddListingImage :one
INSERT INTO listing_images (listing_id, url, sort_order)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetImagesByListing :many
SELECT * FROM listing_images
WHERE listing_id = $1
ORDER BY sort_order ASC;