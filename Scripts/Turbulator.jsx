(function () {
  // Create the main scriptUI window
  var mainWindow = new Window("palette", "Turbulent Displacement Adjustment", undefined, { resizeable: true });

  // Create UI elements
  var seedInput = mainWindow.add("edittext", undefined, "0");
  var applyButton = mainWindow.add("button", undefined, "Apply Turbulent Displacement");
  applyButton.onClick = onApplyButtonClick;

  // Layout UI elements
  mainWindow.orientation = "column";
  mainWindow.alignChildren = ["fill", "top"];
  seedInput.alignment = ["fill", "top"];
  applyButton.alignment = ["fill", "top"];

  // Show the main window
  mainWindow.center();
  mainWindow.show();

  function onApplyButtonClick() {
    // Get the entered seed value
    var seedValue = parseInt(seedInput.text);

    // Check if any layers are selected
    var selectedLayers = getSelectedLayers();
    if (selectedLayers.length === 0) {
      alert("Please select at least one layer to apply the turbulent displacement.");
      return;
    }

    // Loop through selected layers and apply the turbulent displacement effect with the given seed
    for (var i = 0; i < selectedLayers.length; i++) {
      var currentLayer = selectedLayers[i];
      applyTurbulentDisplacement(currentLayer, seedValue);
    }

    alert("Turbulent Displacement applied successfully!");
  }

  // Function to get the selected layers
  function getSelectedLayers() {
    var selectedLayers = [];
    var activeComp = app.project.activeItem;
    if (!(activeComp instanceof CompItem)) {
      return selectedLayers;
    }

    for (var i = 1; i <= activeComp.numLayers; i++) {
      var currentLayer = activeComp.layer(i);
      if (currentLayer.selected) {
        selectedLayers.push(currentLayer);
      }
    }

    return selectedLayers;
  }

  // Function to apply turbulent displacement to a layer
  function applyTurbulentDisplacement(layer, seed) {
    var effect = layer.property("Effects").addProperty("ADBE Turbulent Displace");
    effect.property("Size").setValue([100, 100]);
    effect.property("Complexity").setValue(8);
    effect.property("Contrast").setValue(100);
    effect.property("Offset").setValue(100);
    effect.property("Random Seed").setValue(seed);
  }
})();
