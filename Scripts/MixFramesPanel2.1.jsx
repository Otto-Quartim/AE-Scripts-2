(function() {
    // Function to detect and create hold frame null
    function detectHoldFrames() {
        var comp = app.project.activeItem;
        if (comp instanceof CompItem) {
            // Create the empty null object
            var holdFrameNull = comp.layers.addNull();
            holdFrameNull.name = "Camera Hold Frame Offset Bake";
            holdFrameNull.enabled = false; // Disable the null to hide it

            // Get the selected layers
            var selectedLayers = comp.selectedLayers;

            // Loop through the selected layers and bake their transforms into the null
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                var frameOffset = 1;

                // Check if the layer is a camera or null object (ones)
                if (layer instanceof CameraLayer || layer instanceof AVLayer && layer.nullLayer) {
                    frameOffset = 1;
                } else {
                    // Get the hold frame type from the layer name (twos, threes, fours)
                    var holdFrameType = layer.name.match(/twos|threes|fours/i);
                    if (holdFrameType) {
                        holdFrameType = holdFrameType[0].toLowerCase();
                        if (holdFrameType === "twos") {
                            frameOffset = 2;
                        } else if (holdFrameType === "threes") {
                            frameOffset = 3;
                        } else if (holdFrameType === "fours") {
                            frameOffset = 4;
                        }
                    }
                }

                // Bake the layer's transforms into the null
                var position = layer.transform.position.value;
                var scale = layer.transform.scale.value;
                var rotation = layer.transform.rotation.value;

                holdFrameNull.property("Position").setValueAtTime(layer.inPoint, position);
                holdFrameNull.property("Scale").setValueAtTime(layer.inPoint, scale);
                holdFrameNull.property("Rotation").setValueAtTime(layer.inPoint, rotation);

                for (var j = 1; j <= frameOffset; j++) {
                    holdFrameNull.property("Position").setValueAtTime(layer.inPoint + comp.frameDuration * j, position);
                    holdFrameNull.property("Scale").setValueAtTime(layer.inPoint + comp.frameDuration * j, scale);
                    holdFrameNull.property("Rotation").setValueAtTime(layer.inPoint + comp.frameDuration * j, rotation);
                }

                // Parent the layer to the hold frame null
                layer.parent = holdFrameNull;
            }

            alert("Hold frames detected and baked into the null object.");
        } else {
            alert("Please select layers in a composition.");
        }
    }

    // Create and show the main window
    var mainWindow = new Window("palette", "Hold Frames Detection", undefined);
    mainWindow.orientation = "column";

    // Create and add the "Detect Hold Frames" button
    var detectButton = mainWindow.add("button", undefined, "Detect Hold Frames");
    detectButton.alignment = ["fill", "bottom"];

    // Function to handle "Detect Hold Frames" button click
    detectButton.onClick = function() {
        detectHoldFrames();
    };

    // Show the main window
    mainWindow.show();
})();
