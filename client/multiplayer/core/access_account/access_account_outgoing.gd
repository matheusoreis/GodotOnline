class_name AccessAccountOutgoing extends ClientMessage


var _constants: Constants = Constants.new()


func _init(email: String, password: String) -> void:
	super._init(ClientHeaders.Headers.ACCESS_ACCOUNT)

	self.put_string(email)
	self.put_string(password)
	self.put_int16(_constants.major_version)
	self.put_int16(_constants.minor_version)
	self.put_int16(_constants.revision_version)
