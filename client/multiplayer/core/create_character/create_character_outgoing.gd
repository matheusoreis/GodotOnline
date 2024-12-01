class_name CreateCharacterOutgoing extends ClientMessage


func _init(name: String, gender_id: int, sprite: String) -> void:
	super._init(ClientHeaders.Headers.CREATE_CHARACTER)

	self.put_string(Globals.account_token)
	self.put_string(name)
	self.put_int8(gender_id)
	self.put_string(sprite)
