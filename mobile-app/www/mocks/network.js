(function (window) {
  var Connection = {
    UNKNOWN: "unknown",
    ETHERNET: "ethernet",
    WIFI: "wifi",
    CELL_2G: "2g",
    CELL_3G: "3g",
    CELL_4G: "4g",
    CELL:"cellular",
    NONE: "none"
  };
  window.navigator.connection = window.navigator.connection || {
    type: Connection.UNKNOWN
  } 

  window.setConnectionType = function (type) {
    window.navigator.connection.type = type;
  };
  window.setConnectionType.Connection = Connection;

  window.setConnectionType(window.setConnectionType.Connection.WIFI);
})(window);