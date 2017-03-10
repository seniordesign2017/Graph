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
    return arrayUnique(keys.concat($aliases)).sort();
  },
  populate_dataport_fields = function (device_data) {
    "use strict";
    var $grouping = $("<div>").addClass("well");
    $.each(device_keys(device_data), function (j, key) {
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
  },
  populate_devices = function () {
    "use strict";
    $(".devices").html("");
    $.get("/sensor", function (data) {
      if (0 < data.length) {
        $.each(data, function (i, item) {
          var $device = $("<form>").addClass("device");
          $device.append('<h3>Device: <span class="sn">' + item.sn + "</span>");
          $.get("/sensor/" + item.sn, function (device_data) {
            if (device_data.hasOwnProperty("timestamp")) {
              $device.append($("<span>")
                .addClass("timestamp")
                .text("Last Updated: " + new Date(device_data.timestamp)));
            }
            var $grouping = populate_dataport_fields(device_data);
            $device.append($grouping);
          }).complete(function () {
            $device.append($('<button type="button" class="update_btn btn btn-primary">Update</button>'));
          }).fail(function (msg) {
            console.log(msg);
            var danger = $("<div>"),
              $grouping = populate_dataport_fields({});
            danger.addClass("alert alert-danger");
            danger.attr("role", "alert");
            danger.append("<p>Phyiscal device may not have been synchronized with the cloud. Please write to the device.</p>");
            $device.append(danger);
            $device.append($grouping);
          });
          $(".devices").append($device);
        });
      } else {
        $(".devices").html("");
        var danger = $("<div>");
        danger.addClass("alert alert-danger");
        danger.attr("role", "alert");
        danger.append('<p>No devices found.  Please add devices in the "Devices" tab of your <a href="https://www.exosite.io/business/products">product configuration</a>.</p>');
        $(".devices").append(danger);
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
  update_device = function (sn, postData) {
    "use strict";
    console.log("Updating device sensor data ...");
    $.ajax({
      url: "/sensor/" + sn,
      data: JSON.stringify(postData),
      contentType: "application/json; charset=utf-8",
      method: "POST"
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
    var danger = $("<div>");
    danger.addClass("alert alert-danger");
    danger.attr("role", "alert");
    danger.append('<p>No device aliases found.  Please add a product to your solution under the "Services" tab (Device) of your <a href="https://www.exosite.io/business/solutions">solution configuration</a>.</p>');
    $(".devices").append(danger);
  }).done(function () {
    populate_devices();
  });
});
