javascript:(function() {
	var content = jQuery('#content');
	var grafs = content.text().split('\n\n');

	var cx_date = new Date();
	var monthNames = ["Jan. ","Feb. ","March ","April ","May ","June ","July ","Aug. ","Sept. ","Oct. ","Nov.","Dec. "];
	var cx_month = monthNames[cx_date.getMonth()];
	var amPm = ( cx_date.getHours() < 12 ) ? ' a.m.' : ' p.m.';
	var minutes = cx_date.getMinutes();
	var colon = ":";
	if (minutes < 10) {
		if (minutes == "0") {
			minutes = "";
			colon = "";
		}else{
			minutes = "0"+ minutes ;
		}
	}else{
		minutes = cx_date.getMinutes();
	}
	var hours = cx_date.getHours();
	if (hours > 12) {
		hours -= 12;
	} else if (hours === 0) {
		hours = 12;
	}
	var cx_date_markup = cx_month +  cx_date.getDate() + ', ' + cx_date.getFullYear() + ' at ' + hours + colon + minutes + amPm;

	var cx_content = prompt('Type or paste the correction language here. The Update date and time and all other formatting will be included automatically.\n\n', '');

	var markup = '<hr />\n\n\
	<strong>Updated ' + cx_date_markup + '</strong> <em>' + cx_content + '</em>';

	grafs.splice(grafs.length, 0, markup);

	jQuery('#content').text(grafs.join('\n\n'));
}());