class_name CharacterBase extends CharacterBody2D


@export_category('Nodes')
@export var _name: Label
@export var _camera: Camera2D
@export var _texture: Sprite2D
@export var _animation: AnimationPlayer

@export_category('Definições')
@export var _move_speed: float = 100


enum CHAR_DIRECTION {
	LEFT,
	UP,
	RIGHT,
	DOWN
}

enum CHAR_ACTION {
	IDLE,
	WALKING,
}


var id: int
var character_name: String
var is_local_player: bool = true
var gender: String

var is_movement_blocked: bool = false

var action: CHAR_ACTION = CHAR_ACTION.IDLE
var direction: CHAR_DIRECTION = CHAR_DIRECTION.DOWN

var _is_moving: bool = false
var _time_since_last_send: float = 0.0
var _send_delay: float = 0.05

# Variáveis auxiliares para controlar o rollback
var rollback_distance: float = 3.0
var rollback_duration: float = 0.2
var rollback_timer: float = 0.0


func _ready() -> void:
	_camera.enabled = is_local_player
	_name.text = character_name


func _physics_process(delta: float) -> void:
	if is_local_player:
		_move(delta)
		_update_animation(direction)


func _move(delta: float) -> void:
	if Globals.focus_in_chat:
		return

	if is_movement_blocked:
		_move_backwards(delta)
		return

	var direction_vector: Vector2 = _get_input_direction()

	if direction_vector.length() > 0:
		self.velocity = direction_vector.normalized() * _move_speed
		_is_moving = true
		action = CHAR_ACTION.WALKING

		if direction_vector.x < 0:
			direction = CHAR_DIRECTION.LEFT
		elif direction_vector.x > 0:
			direction = CHAR_DIRECTION.RIGHT
		elif direction_vector.y < 0:
			direction = CHAR_DIRECTION.UP
		elif direction_vector.y > 0:
			direction = CHAR_DIRECTION.DOWN

		_time_since_last_send += delta
		if _time_since_last_send >= _send_delay:
			send_movement()
			_time_since_last_send = 0.0
	else:
		if !_is_moving:
			send_movement()

		velocity = Vector2.ZERO
		_is_moving = false
		action = CHAR_ACTION.IDLE

	move_and_slide()


func _move_backwards(delta: float) -> void:
	if rollback_timer < rollback_duration:
		var backward_vector: Vector2 = Vector2.ZERO

		match direction:
			CHAR_DIRECTION.LEFT:
				backward_vector = Vector2.RIGHT
			CHAR_DIRECTION.UP:
				backward_vector = Vector2.DOWN
			CHAR_DIRECTION.RIGHT:
				backward_vector = Vector2.LEFT
			CHAR_DIRECTION.DOWN:
				backward_vector = Vector2.UP

		var teleport_distance = backward_vector.normalized() * rollback_distance
		position += teleport_distance

		rollback_timer += delta
	else:
		rollback_timer = 0.0
		is_movement_blocked = false
		return

	_is_moving = true
	action = CHAR_ACTION.WALKING
	move_and_slide()


func _get_input_direction() -> Vector2:
	var direction_vector: Vector2 = Vector2(
			Input.get_axis("walking_left", "walking_right"),
			Input.get_axis("walking_up", "walking_down")
	)

	return direction_vector


func _update_animation(character_direction: CHAR_DIRECTION) -> void:
	if _is_moving:
		_play_idle_animation(character_direction)
	else:
		_play_walking_animation(character_direction)


func _play_idle_animation(character_direction: CHAR_DIRECTION):
	match character_direction:
		CHAR_DIRECTION.LEFT:
			_animation.play("walking_left")
		CHAR_DIRECTION.UP:
			_animation.play("walking_up")
		CHAR_DIRECTION.RIGHT:
			_animation.play("walking_right")
		CHAR_DIRECTION.DOWN:
			_animation.play("walking_down")


func _play_walking_animation(character_direction: CHAR_DIRECTION):
	match character_direction:
		CHAR_DIRECTION.LEFT:
			_animation.play("idle_left")
		CHAR_DIRECTION.UP:
			_animation.play("idle_up")
		CHAR_DIRECTION.RIGHT:
			_animation.play("idle_right")
		CHAR_DIRECTION.DOWN:
			_animation.play("idle_down")


func int_to_action(action_int: int) -> CHAR_ACTION:
	var current_action: CHAR_ACTION

	match action_int:
		0:
			current_action = CHAR_ACTION.IDLE
		1:
			current_action = CHAR_ACTION.WALKING
		_ :
			current_action = CHAR_ACTION.IDLE

	return current_action


func int_to_direction(direction_int: int) -> CHAR_DIRECTION:
	var current_direction: CHAR_DIRECTION

	match direction_int:
		0:
			current_direction = CHAR_DIRECTION.LEFT
		1:
			current_direction = CHAR_DIRECTION.UP
		2:
			current_direction = CHAR_DIRECTION.RIGHT
		3:
			current_direction = CHAR_DIRECTION.DOWN
		_ :
			current_direction = CHAR_DIRECTION.DOWN

	return current_direction


func set_texture(current_sprite: String) -> void:
	var texture: CompressedTexture2D = load(
		'res://assets/graphics/entities/characters/' + current_sprite + '.png'
	)

	if texture:
		_texture.texture = texture


func send_movement() -> void:
	MoveCharacterOutgoing.new(action, direction, round(position)).send()


func update_remote_position(remote_action: CHAR_ACTION, remote_direction: CHAR_DIRECTION, remote_position: Vector2) -> void:
	if !is_local_player:
		if remote_action == CHAR_ACTION.WALKING:
			_is_moving = true
		else:
			_is_moving = false

		var tween = create_tween()
		tween.tween_property(self, "position", remote_position, 0.1)
		_update_animation(remote_direction)
