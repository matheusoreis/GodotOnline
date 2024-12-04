class_name CharacterDataUI extends PanelContainer

@export_category('Componentes')
@export var character_name: Label
@export var character_gender: Label


func _on_close_button_pressed() -> void:
	self.hide()


func update_character_data(char_name, char_gender):
	character_name.text = char_name
	character_gender.text = char_gender
