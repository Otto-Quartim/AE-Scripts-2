(function() {
    // Create and show the main window
    var mainWindow = new Window("palette", "Camera Parenting", undefined);
    mainWindow.orientation = "column";

    // Create group for layer and camera selection
    var selectionGroup = mainWindow.add("group");
    selectionGroup.orientation = "row";
    selectionGroup.alignment = ["fill", "top"];

    // Add buttons to select layers and cameras
    var layerButton = selectionGroup.add("button", undefined, "Select Layer");
    var cameraButton = selectionGroup.add("button", undefined, "Select Camera");

    // Create group for rotation checkbox
    var rotationGroup = mainWindow.add("group");
    rotationGroup.orientation = "row";
    rotationGroup.alignment = ["fill", "top"];

    // Add checkbox for rotation
    var rotationCheckbox = rotationGroup.add("checkbox", undefined, "Enable Rotation");

    // Create and add the "Parent" button
    var parentButton = mainWindow.add("button", undefined, "Parent");
    parentButton.alignment = ["fill", "bottom"];

    // Function to handle "Select Layer" button click
    layerButton.onClick = function() {
        var selectedLayer = app.project.activeItem.selectedLayers[0];
        if (selectedLayer) {
            // Store the selected layer for later use
            layer = selectedLayer;
            alert("Layer selected: " + layer.name);
        } else {
            alert("Please select a layer.");
        }
    };

    // Function to handle "Select Camera" button click
    cameraButton.onClick = function() {
        var selectedCamera = app.project.activeItem.selectedLayers[0];
        if (selectedCamera && selectedCamera instanceof CameraLayer) {
            // Store the selected camera for later use
            camera = selectedCamera;
            alert("Camera selected: " + camera.name);
        } else {
            alert("Please select a camera layer.");
        }
    };

    // Function to handle "Parent" button click
    parentButton.onClick = function() {
        if (layer && camera) {
            // Check if rotation checkbox is enabled
            var enableRotation = rotationCheckbox.value;

            // Create a new composition to apply the parenting
            var newComp = app.project.items.addComp("Parented Comp", 1920, 1080, 1, 10, 30);
            var newLayer = newComp.layers.add(layer);
            var newCamera = newComp.layers.add(camera);

            // Parent the layer to the camera and vice versa
            newLayer.parent = newCamera;
            newCamera.parent = newLayer;

            // Enable/disable rotation based on the checkbox value
            newLayer.rotation.setValue(enableRotation ? [0, 0, 0] : [0, 0, 0]);
            newCamera.rotation.setValue(enableRotation ? [0, 0, 0] : [0, 0, 0]);

            alert("Parenting completed! Result in a new composition layer.");

            // Close the main window after completing the parenting
            mainWindow.close();
        } else {
            alert("Please select a layer and a camera.");
        }
    };

    // Show the main window
    mainWindow.show();
})();
