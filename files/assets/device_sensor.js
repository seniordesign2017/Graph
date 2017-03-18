var $aliases = [],
  arrayUnique = function (array) {
    "use strict";
    var a = array.concat(), i, j;
    for (i = 0; i < a.length; ++i) {
      for (j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  },
  device_keys = function (item) {
    "use strict";
    var keys = Object.keys(item).reduce(function (newArray, key) {
      if (key !== "pid" && key !== "rid" && key !== "ip" && key !== "timestamp" && key !== "sn") {
        newArray.push(key);
      }
      return newArray;
    }, []);
    if (Object.keys($aliases).length === 0 && keys.length === 0) {
      return [];
    } else {
      return arrayUnique(keys.concat($aliases)).sort();
    }
  },
  populate_dataport_fields = function (device_data) {
    "use strict";
    var $grouping = $("<div>").addClass("well device-data"),
      keys = device_keys(device_data);
    if (keys.length !== 0) {
      $.each(keys, function (j, key) {
        var $fs = $("<fieldset>"),
          $dataport = $("<div>").addClass("form-group row"),
          $input = $("<div>").addClass("col-10");
        if (!device_data.hasOwnProperty(key)) {
          device_data[key] = "";
        }
        $fs.append('<label for="example-text-input" class="col-2 col-form-label">' + key + "</label>");
        $input.append('<input class="form-control" type="text" name="' + key + '" value="' + device_data[key] + '"/>');
        $grouping.append($fs.append($dataport.append($input)));
      });
      return $grouping;
    } else {
      return;
    }
  },
  danger_alert = function (html) {
    var danger = $("<div>");
    danger.addClass("alert alert-danger");
    danger.attr("role", "alert");
    danger.append(html);
    return danger;
  },
  populate_devices = function () {
    "use strict";
    $(".devices").html("");
    $.get("/device", function (data) {
      if (0 < data.length) {
        $.each(data, function (i, item) {
          var $device = $("<form>").addClass("device");
          $device.append('<h3>Device: <span class="sn">' + item.sn + "</span>");
          $.get("/device/" + item.sn, function (device_data) {
            if (device_data.hasOwnProperty("timestamp")) {
              $device.append($("<span>")
                .addClass("timestamp")
                .text("Last Updated: " + new Date(device_data.timestamp)));
            }
            var $grouping = populate_dataport_fields(device_data);
            if (item.status === "notactivated") {
              $device.append(danger_alert(
                "<p>Device is not activated.  Please activate the device before writing to it.</p>" +
                "<pre><code>export PRODUCT_ID=\"" + device_data.pid + "\"<br/>export SERIAL_NUMBER=\"" + item.sn + "\"<br/>curl -s -k https://${PRODUCT_ID}.m2.exosite.com/provision/activate \\<br/>  -H \"Content-Type: application/x-www-form-urlencoded; charset=utf-8\" \\<br/>  -d \"vendor=${PRODUCT_ID}&model=${PRODUCT_ID}&sn=${SERIAL_NUMBER}\"</code></pre>"));
            }
            if ($grouping) {
              $device.append($grouping);
            }
          }).complete(function () {
            if ($('.device-data').length !== 0) {
              $device.append($('<button type="button" class="update_btn btn btn-primary">Update</button>'));
            } else {
              $device.append(danger_alert("<p>Device has no defined sensors.  Please add some sensors to the device under the \"Devices\" tab of your <a href=\"https://www.exosite.io/business/products\">product configuration</a>.</p>"));
            }
          }).fail(function (msg) {
            console.log(msg);
            var $grouping = populate_dataport_fields({});
            $device.append(danger_alert("<p>Phyiscal device may not have been synchronized with the cloud. Please write to the device.</p>"));
            if ($grouping) {
              $device.append($grouping);
            }
          });
          $(".devices").append($device);
        });
      } else {
        $(".devices").html("");
        $(".devices").append(danger_alert('<p>No devices found.  <button type="button" id="deviceCreate" class="btn btn-primary" data-toggle="modal" data-target="#deviceCreateModal">Create Device</button></p>'));
      }
    }).fail(function (msg) {
      console.log(msg);
      $(".devices").html("");
      $(".devices").append(
        $("<h3>").text("No devices"),
        $("<span>").append("<a href='https://www.exosite.io/business/products'>Create devices</a>")
      );
    });
  },
  create_device = function (sn) {
    "use strict";
    console.log("Creating device ...");
    $.ajax({
      url: "/device/" + sn,
      contentType: "application/json; charset=utf-8",
      method: "POST"
    }).done(function () {
      populate_devices();
    }).complete(function () {
      $('#deviceCreateModal').modal('hide');
    }).fail(function (msg) {
      console.log(msg);
    });
  },
  update_device = function (sn, postData) {
    "use strict";
    console.log("Updating device sensor data ...");
    $.ajax({
      url: "/device/" + sn,
      data: JSON.stringify(postData),
      contentType: "application/json; charset=utf-8",
      method: "PUT"
    }).done(function () {
      populate_devices();
    }).fail(function (msg) {
      console.log(msg);
    });
  },
  build_postdata = function (fieldset) {
    "use strict";
    var postData = {};
    $.each(fieldset, function (i, item) {
      postData[item.name] = item.value;
    });
    return postData;
  };

$(document).on("click", "#deviceCreate", function (e) {
  "use strict";
  e.preventDefault();
  $('#deviceCreateModal').modal('show');
});

$(document).on("click", "#device-save-cancel", function (e) {
  "use strict";
  e.preventDefault();
  $('#deviceCreateModal').modal('hide');
});

$(document).on("click", "#device-save", function (e) {
  "use strict";
  e.preventDefault();
  var sn = $("#device-save-sn").val();
  if (sn !== "") {
    create_device(sn);
  }
});

$(document).on("click", ".update_btn", function (e) {
  "use strict";
  e.preventDefault();
  var sn = $(this).parent().find(".sn").text(),
    postData = build_postdata($(this).parent().find("input"));
  update_device(sn, postData);
});

$(document).ready(function () {
  "use strict";
  $.get("/aliases", function (data) {
    $aliases = data;
  }).fail(function (msg) {
    console.log(msg);
    $(".devices").html("");
    $(".devices").append(danger_alert('<p>No device aliases found.  Please add a product to your solution under the "Services" tab (Device) of your <a href="https://www.exosite.io/business/solutions">solution configuration</a>.</p>'));
  }).done(function () {
    populate_devices();
  });
});
