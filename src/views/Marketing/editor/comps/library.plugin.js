tinymce.PluginManager.add('library', function(editor) {
  // Add a button that opens a window
  editor.ui.registry.addButton('library', {
    text: 'library',
    onAction() {
      editor.settings.librarySelectorCallback(editor);
    }
  });

  return {
    getMetadata() {
      return  {
        name: "library plugin"
      };
    }
  };
});
