class_name MoveCharacterOutgoing extends ClientMessage


func _init(action: int, direction: int, position: Vector2) -> void:
	super._init(ClientHeaders.Headers.MOVE_CHARACTER)

	put_string(Globals.account_token)
	put_int8(action)
	put_int8(direction)
	put_int32(position.x)
	put_int32(position.y)
