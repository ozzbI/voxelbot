BasicControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.rotationSpeed = 0.005;

	this.moveForward = false;
	this.moveBackward = false;

	this.rotateRight = false;
	this.rotateLeft = false;

	this.freeze = false;


	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}


	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.rotateLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.rotateRight = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.rotateLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.rotateRight = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.freeze ) {

			return;

		}

		var actualMoveSpeed = delta * this.movementSpeed;



		if ( this.moveForward ) this.object.position.add((new THREE.Vector3(actualMoveSpeed, 0, 0))
            .applyMatrix4((new THREE.Matrix4).extractRotation(cube.matrix)));

		if ( this.moveBackward ) this.object.position.add((new THREE.Vector3(-actualMoveSpeed, 0, 0))
            .applyMatrix4((new THREE.Matrix4).extractRotation(cube.matrix)));

		var actualRotationSpeed = delta * this.rotationSpeed;

		if ( this.rotateLeft ) this.object.rotation.y += actualRotationSpeed;
		if ( this.rotateRight ) this.object.rotation.y -= actualRotationSpeed;

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

};
