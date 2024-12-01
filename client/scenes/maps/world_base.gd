class_name WorldBase extends Node2D


@export var spwan_location: Node2D
@export var layers: Array[TileMapLayer]


func get_character_by_id(id: int) -> CharacterBase:
	for child in spwan_location.get_children():
		if child.name == str(id):
			return child as CharacterBase

	return null


func spawn_character(id: int, character_name: String, direction: int, character_position: Vector2, sprite: String, local_player: bool) -> void:
	var character_preload: PackedScene = preload(
		'res://scenes/entities/character/character_base.tscn'
	)

	var character_instantiate: CharacterBase = character_preload.instantiate()
	character_instantiate.name = str(id)
	character_instantiate.id = id
	character_instantiate.character_name = character_name
	character_instantiate.position = character_position
	character_instantiate.is_local_player = local_player
	character_instantiate.direction = character_instantiate.int_to_direction(
		direction
	)

	character_instantiate.set_texture(sprite)
	spwan_location.add_child(character_instantiate)


func get_block_tiles_as_json() -> String:
	var blocks = {}

	for layer in layers:
		var layer_name = layer.name
		var layer_tiles = []

		for y in range(layer.get_used_rect().size.y):
			for x in range(layer.get_used_rect().size.x):
				var coords = Vector2i(x, y)

				# Obtém os dados do tile na posição (x, y)
				var tile_data = layer.get_cell_tile_data(coords)

				# Se o tile não tiver nada só continua a lógica
				if tile_data == null:
					continue

				# Verifica se o tile tem algum polygon
				var polygons_count = tile_data.get_collision_polygons_count(0)

				if polygons_count > 0:
					layer_tiles.append({
						"x": x,
						"y": y,
						"tile_id": layer.get_cell_source_id(coords)
					})

		if layer_tiles.size() > 0:
			blocks[layer_name] = layer_tiles

	var json_data = JSON.stringify(blocks)

	return json_data


#func get_custom_data_layer_tiles() -> String:
	#var blocks = {}
#
	## Itera sobre cada camada no array `attributes_layers`
	#for layer in attributes_layers:
		#var layer_name = layer.name  # Nome da camada
		#var layer_tiles = []
#
		## Obtém o retângulo de uso da camada (área onde há tiles)
		#var used_rect = layer.get_used_rect()
#
		## Itera sobre as células dentro do retângulo de uso
		#for y in range(used_rect.position.y, used_rect.position.y + used_rect.size.y):
			#for x in range(used_rect.position.x, used_rect.position.x + used_rect.size.x):
				#var coords = Vector2i(x, y)
#
				## Obtém os dados do tile na posição (x, y)
				#var tile_data = layer.get_cell_tile_data(coords)
#
				## Se não houver dados no tile, continua
				#if tile_data == null:
					#continue
#
				## Agora obtemos os dados personalizados, iterando sobre todas as camadas de dados personalizados
				#var all_custom_data = get_all_custom_data_at(layer, coords)
#
				#if all_custom_data.size() > 0:  # Se existirem dados personalizados
					#layer_tiles.append({
						#"x": x,
						#"y": y,
						#"custom_data": all_custom_data,  # Adiciona os dados personalizados ao JSON
					#})
#
		## Se a camada tiver tiles com dados personalizados, adiciona ao resultado final
		#if layer_tiles.size() > 0:
			#blocks[layer_name] = layer_tiles
#
	## Serializa o resultado para JSON
	#var json_data = JSON.stringify(blocks)
	#return json_data

#
## Função auxiliar para obter todos os dados personalizados de um tile
#func get_all_custom_data_at(layer: TileMapLayer, coords: Vector2i) -> Dictionary:
	#var all_custom_data = {}
#
	## Obtém os dados do tile na posição especificada
	#var tile_data = layer.get_cell_tile_data(coords)
#
	#if tile_data == null:
		#return all_custom_data  # Se não houver dados, retorna um dicionário vazio
#
	## Percorre todas as camadas de dados personalizados no TileSet
	##layer.tile_set.get_custom_data_layers_count()
	#for j in range(layer.tile_set.get_custom_data_layers_count()):
		#var custom_data_name = layer.tile_set.get_custom_data_layer_name(j)
		## Obtém os dados personalizados do tile para o CustomDataLayer atual
		#var custom_data = tile_data.get_custom_data(custom_data_name)
		#all_custom_data[custom_data_name] = custom_data
#
	#return all_custom_data
