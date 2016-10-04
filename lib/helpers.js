exports.median = function(arr) {
  if (!arr.length) return 0;

  var middle = Math.floor(arr.length / 2);
  var isEven = arr.length % 2 === 0;

  return isEven ? (arr[middle] + arr[middle - 1]) / 2 : arr[middle];
}

exports.mode = function(arr) {
  if (arr.length == 0) return null;

  var map = {};
  var maxEl = arr[0], maxCount = 1;

  for (var i = 0; i < arr.length; i++) {
    var el = arr[i];

    if (map[el] == null) map[el] = 1;
    else map[el]++;  

    if (map[el] > maxCount) {
      maxEl = el;
      maxCount = map[el];
    }
  }

  return maxEl;
}

exports.binaryInsert = function(val, array) {
	var i = 0, len = array.length - 1, mid;

	if(len == 0){
		array.push(val);
		return;
	}

	while (i <= len) {
		mid = (i + len) / 2 | 0;

		if (array[mid] > val) {
			len = mid - 1;
			continue;
		}

		i = mid + 1;

		if (array[mid] === val) {
			break; 
		}
	}

	return array.splice(i, 0, val);
}