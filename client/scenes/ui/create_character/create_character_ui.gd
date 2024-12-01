class_name CreateCharacterUI extends PanelContainer

@export_category('Componentes')
@export var name_line: LineEdit
@export var create_button: Button
@export var genders_button: OptionButton
@export var sprite_preview: Sprite2D
@export var avaliable_sprites: Array[CompressedTexture2D]

@export_category('Referências')
@export var character_list_ui: PanelContainer

var current_sprite_index: int = 0


func _on_close_button_pressed() -> void:
	self.hide()
	character_list_ui.show()


func _on_previous_sprite_pressed() -> void:
	if current_sprite_index > 0:
		current_sprite_index -= 1
		_update_sprite_preview()


func _on_next_sprite_pressed() -> void:
	if current_sprite_index < avaliable_sprites.size() - 1:
		current_sprite_index += 1
		_update_sprite_preview()


func _update_sprite_preview() -> void:
	sprite_preview.texture = avaliable_sprites[current_sprite_index]


func _on_create_button_pressed() -> void:
	var selected_texture: CompressedTexture2D = avaliable_sprites[current_sprite_index]
	var texture_path: String = selected_texture.resource_path
	var texture_file_name_extension: String = texture_path.get_file()
	var texture_file_name: String = texture_file_name_extension.get_basename()

	CreateCharacterOutgoing.new(
		name_line.text,
		genders_button.get_selected_id(),
		texture_file_name
	).send()
