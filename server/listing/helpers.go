package listing

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func pgUUID(id uuid.UUID) pgtype.UUID {
	return pgtype.UUID{Bytes: id, Valid: true}
}

func pgText(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: s != ""}
}

func mustParse(s string) [16]byte {
	id, err := uuid.Parse(s)
	if err != nil {
		return [16]byte{}
	}
	return id
}
