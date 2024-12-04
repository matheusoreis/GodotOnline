class_name CharacterDataOutgoing extends ClientMessage


func _init() -> void:
	super._init(ClientHeaders.Headers.CHARACTER_DATA)

	self.put_string(Globals.account_token)
