class_name DeleteCharacterOutgoing extends ClientMessage


func _init(character_id: int) -> void:
	super._init(ClientHeaders.Headers.DELETE_CHARACTER)

	self.put_string(Globals.account_token)
	self.put_int32(character_id)
