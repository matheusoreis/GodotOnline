class_name CharacterListOutgoing extends ClientMessage


func _init() -> void:
	super._init(ClientHeaders.Headers.CHARACTER_LIST)

	self.put_string(Globals.account_token)
