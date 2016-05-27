var Settings = {
  isMuted: false,
  storeName: '250-settings',

  load: function() {
    var settings = JSON.parse(localStorage.getItem(this.storeName)) || {};

    this.isMuted = settings.isMuted || this.isMuted;
  },

  save: function() {
    localStorage.setItem(this.storeName, JSON.stringify(this));
  },

  set: function(key, value) {
    this[key] = value;
    this.save();
  }
}