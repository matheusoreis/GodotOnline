export const ServerHeaders = {
	Ping: 0,
	Alert: 1,
	Notification: 2,
	AccessAccount: 3,
	CreateAccount: 4,
	DeleteAccount: 5,
	RecoverAccount: 6,
	ChangePassword: 7,
	CharacterList: 8,
	CreateCharacter: 9,
	DeleteCharacter: 10,
	SelectCharacter: 11,
	MapCharactersTo: 12,
	NewCharacterTo: 13,
	MoveCharacter: 14,
	BlockCharacterMovement: 15,
	DisconnectCharacter: 16,
	TeleportCharacter: 17,
	ChatMessage: 18,
	EmoteMessage: 19,
} as const;

export type ServerHeader = (typeof ServerHeaders)[keyof typeof ServerHeaders];
