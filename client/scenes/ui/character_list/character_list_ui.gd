class_name CharacterListUI extends PanelContainer


@export_category('Referências')
@export var slots_hbox: HBoxContainer


func update_character_panels(characters: Array, max_characters: int) -> void:
	var slot_panel_preload: PackedScene = preload(
		'res://scenes/ui/character_list/character_slot_ui.tscn'
	)

	for child in slots_hbox.get_children():
		slots_hbox.remove_child(child)
		child.queue_free()

	for i in range(max_characters):
		var slot_panel_instantiate: Panel = slot_panel_preload.instantiate()
		slots_hbox.add_child(slot_panel_instantiate)

		var character_content: VBoxContainer = slot_panel_instantiate.get_node(
			'content_margin/content_vbox'
		)

		var new_character_button: Button = slot_panel_instantiate.get_node(
			'content_margin/new_button'
		)

		if i < characters.size():
			var character_data = characters[i]

			var name_label: Label = slot_panel_instantiate.get_node(
				'content_margin/content_vbox/name_label'
			)
			if name_label:
				name_label.text = character_data["character_name"]


			var character_sprite_2d: Sprite2D = slot_panel_instantiate.get_node(
				'content_margin/content_vbox/sprite_panel/sprite'
			)
			if character_sprite_2d:
				var character_sprite: String = str(character_data['character_sprite'])
				var character_sprite_texture: CompressedTexture2D = load(
					'res://assets/graphics/entities/characters/' + character_sprite + '.png'
				)
				character_sprite_2d.texture = character_sprite_texture

			var character_animation: AnimationPlayer = slot_panel_instantiate.get_node(
				'content_margin/content_vbox/sprite_panel/animation_player'
			)
			if character_animation:
				character_animation.play('walking')

			var play_button: Button = slot_panel_instantiate.get_node(
				'content_margin/content_vbox/play_button'
			)
			if play_button:
				play_button.pressed.connect(
					_on_play_button_pressed.bind(
						character_data["character_id"],
					)
				)

			var delete_button: Button = slot_panel_instantiate.get_node(
				'content_margin/content_vbox/delete_button'
			)
			if delete_button:
				delete_button.pressed.connect(
					_on_delete_button_pressed.bind(
						character_data["character_id"]
					)
				)

			character_content.show()
			new_character_button.hide()
		else:
			character_content.hide()
			new_character_button.show()

			if new_character_button:
				new_character_button.pressed.connect(
					_on_new_button_pressed.bind()
				)


func _on_new_button_pressed() -> void:
	self.hide()

	var create_char_ui: PanelContainer = get_tree().root.get_node(
		'/root/main/menu_ui/create_character_ui'
	)
	create_char_ui.show()


func _on_play_button_pressed(id: int) -> void:
	SelectCharacterOutgoing.new(id).send()


func _on_delete_button_pressed(id: int) -> void:
	DeleteCharacterOutgoing.new(id).send()


func _on_close_button_pressed() -> void:
	get_tree().quit()
