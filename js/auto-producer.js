(function() {
    var APversion = ' v1.3.0';
    var storySelection = '0';
    var additionalAddOns = [];
    var relatedText = '';
    var relatedURL = '';

// extend _init
    var _init = jQuery.ui.dialog.prototype._init;
    jQuery.ui.dialog.prototype._init = function () {
        var self = this;

        // apply original arguments
        _init.apply(this, arguments);
        //https://github.com/jasonday/jQuery-UI-Dialog-extended
        //patch
        /*
        jQuery.ui.dialog.overlay.events = $.map('focus,keydown,keypress'.split(','), function (event) {
            return event + '.dialog-overlay';
        }).join(' ');
        */
    };
// end _init

    function getDPOtip() {
        //return a random DPO production tip
        var tips = Array(
            'The #justposted-all channel in Slack is a great place to catch up on everything that has been posted recently.',
            'The #trending channel in Slack is a great place to see what stories are performing well.',
            '7-8 p.m. is a great time to post strong content on Facebook as we have a lot of fans active at that time.',
            'Bookmark the WordPress pages you use most frequently. It will save you a lot of time!',
            'Don\'t forget to check partner and sister sites for great content.',
            'Want to improve your headline? Drop it into the #headlinerodeo channel in Slack!',
            'Don\'t forget to put your team\'s stories on the Digital Planner to make sure they get some homepage love.',
            'Ask yourself: Is this story alert-worthy?',
            'Have you looked at Google Trends lately?',
            'If you stay positive, you\'ll see opportunities instead of obstacles. Widad Akwari',
            'You\'re off to great places, today is your day. Your mountain is waiting, so get on your way. Dr. Suess',
            'Attitude is a little thing that makes a big difference. Winston Churchill',
            'Believe you can and you\'re halfway there. Teddy Roosevelt',
            'Make each day your masterpiece. John Wooden',
            'Success is the sum of small efforts repeated day in and day out. Robert Collier',
            'Tough times never last, but tough people do. Robert H. Schuller',
        );
        var ceiling = tips.length;
        var index = Math.floor(Math.random() * ceiling);
        return tips[index];

    }
    function HTMLescape(html){
        return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
    }

    //not used anymore, was used simply for styling the old design.
    function pad(n) {
        return (n < 10 && n >= 0) ? ("&nbsp;&nbsp;" + n) : n;
    }

    function padNum(n) {
        return (n < 10 && n >= 0) ? ("0" + n) : n;
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(function (key) {
                return object[key] === value;
        });
    }

    function vSec() {
        var dt = new Date();
        var secs = dt.getSeconds() + (60 * dt.getMinutes());
        return secs;
    }

    function serialize(obj, prefix) {
        var str = [], p;
        for(p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    function stripTheHTML(html) {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return tmp.textContent || tmp.innerText || "";
    }
    
    function slugItUp(inText) {
        return inText.toLowerCase().replace(/[^\w\ ]+/g,'').replace(/ +/g,'-');
    }

    function addslashes(str) {
        str = str.replace(/\\/g, '\\\\');
        str = str.replace(/\'/g, '\\\'');
        str = str.replace(/\"/g, '\\"');
        str = str.replace(/\0/g, '\\0');
        return str;
    }
     
    function stripslashes(str) {
        str = str.replace(/\\'/g, '\'');
        str = str.replace(/\\"/g, '"');
        str = str.replace(/\\0/g, '\0');
        str = str.replace(/\\\\/g, '\\');
        return str;
    }

    function fixPounds(str) {
        str = 
        str = str.replace(/&#8212;/g, "--");
        str = str.replace(/&#8216;/g, "'");
        str = str.replace(/&#8217;/g, "'");
        str = str.replace(/&apos;/g, "'");
        str = str.replace(/&#8220;/g, '"');
        str = str.replace(/&#8221;/g, '"');
        str = str.replace(/&#8212;/g, "--");
        return str;
    }

    function findOne(haystack, arr) {
        return arr.some(function (v) {
            return haystack.indexOf(v) >= 0;
        });
    };

    function createCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }
    
    function autoProducerPost() {

        function captureSections() {
            var output = [];
            jQuery('#categorychecklist input:checked').each(function(){
                output.push(jQuery(this).attr('value'));
            });
            return output;
        }

        function captureSectionsHelp() {
            var output = [];
            jQuery('#categorychecklist input:checked').each(function(){
                var secName = jQuery(this).parent().clone().children().remove().end().text();
                output.push(secName.trim());
            });
            return output;
        }
        function captureTrustSections() {
            var output = [];
            jQuery('#type-of-workchecklist input:checked').each(function(){
                output.push(jQuery(this).attr('value'));
            });
            return output;
        }
        function captureTrustSectionsHelp() {
            var output = [];
            jQuery('#type-of-workchecklist input:checked').each(function(){
                var secName = jQuery(this).parent().clone().children().remove().end().text();
                output.push(secName.trim());
            });
            return output;
        }
        function captureTags() {
            var output = [];
            jQuery('#tagsdiv-post_tag .tagchecklist > span').each(function(){
                var tempTag = jQuery(this).clone().children().remove().end().text();
                output.push(tempTag.trim());
            });
            return output;
        }

        function captureFeatures() {
            var output = [];
            jQuery('#tagsdiv-feature .tagchecklist > span').each(function(){
                var tempTag = jQuery(this).clone().children().remove().end().text();
                if (tempTag.match(/Outstream/)) {
                    output.push(tempTag.trim());
                }
            });
            return output;
        }

        function captureAppleNews() {
            //do nothing because apple news is gone, remove this later
            // var output = [];
            // jQuery('#apple-news-publish div.section input:checked').each(function() {
            //     var checked = getKeyByValue(appleNewsSections, jQuery(this).attr('id'));
            //     if (typeof checked != 'undefined') {
            //         output.push(checked);
            //     }
            // });
            // return output;
        }

        function captureNew() {
            var optionObject = {};
            var newTitle = null;
            loop:
            while(true) {
                newTitle = prompt('What should we call this option?\n\n','');
                if (newTitle !== '' && newTitle !== null) {
                    break loop;
                } else {
                    prompt('We need a title!\n\n','');
                }

            }
            optionSetSelected = prompt('Which option set should this be associated with? (ENTER for "News")\n\n' +
                        '1. News\n\n' +
                        '2. Sports\n\n' +
                        '3. Politics\n\n' +
                        '4. Business\n\n' +
                        '5. Entertainment\n\n' +
                        '6. Opinion\n\n' +
                    '\n\n','1');
            switch (optionSetSelected) {
                case '1':
                    optionSetSelected = 'news';
                    break;
                case '2':
                    optionSetSelected = 'sports';
                    break;
                case '3':
                    optionSetSelected = 'politics';
                    break;
                case '4':
                    optionSetSelected = 'business';
                    break;
                case '5':
                    optionSetSelected = 'entertainment';
                    break;
                case '6':
                    optionSetSelected = 'opinion';
                    break;
                default :
                    optionSetSelected = 'news';
                    break;
            }
            notifySelected = prompt('Which account to notify?\n\n' +
                '1. Breaking\n\n' +
                '2. Sports\n\n' +
                '3. Politics\n\n' +
                '4. Business\n\n' +
                '5. Enterprise\n\n' +
                '6. Investigations\n\n' +
                '7. Entertainment\n\n' +
                '8. Opinion\n\n' +
                '\n\n','1');
            switch (notifySelected) {
                case '1':
                    notifySelected = 'breaking';
                    break;
                case '2':
                    notifySelected = 'sports';
                    break;
                case '3':
                    notifySelected = 'politics';
                    break;
                case '4':
                    notifySelected = 'business';
                    break;
                case '5':
                    notifySelected = 'enterprise';
                    break;
                case '6':
                    notifySelected = 'investigations';
                    break;
                case '7':
                    notifySelected = 'entertainment';
                    break;
                case '8':
                    notifySelected = 'opinion';
                    break;
                default :
                    notifySelected = 'breaking';
                    break;
            }
            var newRelated = confirm('Should Related by Primary Tag be added to stories automatically? (cancel for no)');
            optionObject.title = newTitle;
            optionObject['check-sections'] = captureSections();
            optionObject['trust'] = captureTrustSections();
            optionObject['add-tags'] = captureTags();
            optionObject['primary-section'] = document.getElementById(sectionSelect).value;
            optionObject['primary-tag'] = document.getElementById(tagSelect).value;
            optionObject.features = captureFeatures();
            optionObject['apple-news'] = captureAppleNews();
            optionObject.related = newRelated;
            var tagString = '#'+tagSelect+' option[value="'+optionObject['primary-tag']+'"]';
            optionObject['help-primary-tag'] = (jQuery(tagString).text() == ' ') ? '' : jQuery(tagString).text();
            optionObject['help-sections'] = captureSectionsHelp();
            optionObject['help-trust'] = captureTrustSectionsHelp();
            var secString = '#'+sectionSelect+' option[value="'+optionObject['primary-section']+'"]';
            optionObject['help-primary-section'] = (jQuery(secString).text() == ' ') ? '' : jQuery(secString).text();
            optionObject['option-set'] = optionSetSelected;  //(optionSetSelected =='2') ? 'sports' : 'news';
            optionObject['notifications'] = notifySelected;
            if (newTitle !== '' && newTitle !== null) {
                if (confirm('You\'re about to submit a new option called ' + newTitle + '. Are you sure?')) {
                    var i = document.createElement("img");
                    i.style.cssText = 'display:none;';
                    alert("Send this to chris\n\n\n"+JSON.stringify(optionObject, null, 4)+"\n\n\n");
                    console.log("here is what to send");
                    console.log(optionObject);
                    i.src = 'http://plus.denverpost.com/autoproducer/ap-new.php?'+serialize(optionObject);
                }
            } else {
                alert('Sorry, something went wrong. Try again. \n\n\nOh, and next time -- don\'t do whatever you did that broke it this time.');
            }
        }

        function checkSections(tags){
            for (var i=0,len=tags.length;i<len;i++){
                var category = document.getElementById('in-category-'+tags[i]);
                if (category != null ){
                    document.getElementById('in-category-'+tags[i]).checked = true;
                }
            }
            // uncheck Uncategorized
            document.getElementById('in-category-1').checked = false;
        }

        function checkTrustSections(tags){
            //trust project selection
            for (var i=0,len=tags.length;i<len;i++){
                var worktype = document.getElementById('in-type-of-work-'+tags[i]);
                if (worktype !== null){
                    document.getElementById('in-type-of-work-'+tags[i]).checked = true;
                }
            }
        }
        function setNotification(notify){
            console.log('inside set notify');
            //select the correct notification box here so that slack gets pinged on status change
            switch(notify){
                case 'sports':
                    document.getElementById('following_usergroups12195').checked = true
                    break;
                case 'breaking':
                    document.getElementById('following_usergroups17787').checked = true
                    break;
                case 'politics':
                    document.getElementById('following_usergroups17788').checked = true
                    break;
                case 'business':
                    document.getElementById('following_usergroups17790').checked = true
                    break;
                case 'enterprise':
                    document.getElementById('following_usergroups17789').checked = true
                    break;
                case 'investigations':
                    document.getElementById('following_usergroups17791').checked = true
                    break;
                case 'entertainment':
                    document.getElementById('following_usergroups17794').checked = true
                    break;
                case 'opinion':
                    document.getElementById('following_usergroups17793').checked = true
                    break;
                default:
                    document.getElementById('following_usergroups17787').checked = true
            }

        }

        function uncheckLatestSection() {
            document.getElementById('in-category-48').checked = false;
        }

        function checkAppleNewsBoxes(boxes) {
            //do nothing since they removed apple news, remove more of this later.
            // for (var i=0,len=boxes.length;i<len;i++){
            //     document.getElementById(appleNewsSections[boxes[i]]).checked = true;
            // }
        }

        function sendtonews() {
            //uncheck the send to news box
            console.log('unckeck ssend to news');
            document.getElementById('fm-dfm_sendtonews_disable-0-sendtonews_disable-0').checked = true;
        }


        function uncheckAppleNewsNews() {
            //do nothing in here because apple news is gone, remove this in the future.
            //document.getElementById('apple-news-section-0ca35a0e-e4ed-3ff0-b73b-1bee2bc33390').checked = false;
        }

        function primaryOptions(sectionPrimary,tagPrimary) {
            if ( (typeof sectionPrimary != 'undefined' && sectionPrimary !== '') && document.getElementById(sectionSelect).value === '' ) {
                document.getElementById(sectionSelect).value = sectionPrimary;
            }
            if ( (typeof tagPrimary != 'undefined' && tagPrimary !== '') && document.getElementById(tagSelect).value === '' ) {
                document.getElementById(tagSelect).value = tagPrimary;
            }
        }

        function addTag(newTags) {
            for(var i=0,len=newTags.length;i<len;i++) {
                document.getElementById('new-tag-post_tag').value = newTags[i];
                jQuery('#post_tag .ajaxtag input.button.tagadd').click();
            }
        }

        function addFeatures(newFeatures) {
            for(var i=0,len=newFeatures.length;i<len;i++) {
                document.getElementById('new-tag-feature').value = newFeatures[i];
                jQuery('#feature .ajaxtag input.button.tagadd').click();
            }
        }

        function addAPauthor() {
            jQuery('#coauthors_hidden_input').remove();
            jQuery('.suggest.coauthor-row:first-child').append('<input id="coauthors_hidden_input" name="coauthors[]" value="the-associated-press" type="hidden">');
        }

        function addWaPoauthor() {
            jQuery('#coauthors_hidden_input').remove();
            jQuery('.suggest.coauthor-row:first-child').append('<input id="coauthors_hidden_input" name="coauthors[]" value="the-washington-post" type="hidden">');
        }

        function addEditorialauthor() {
            jQuery('#coauthors_hidden_input').remove();
            jQuery('.suggest.coauthor-row:first-child').append('<input id="coauthors_hidden_input" name="coauthors[]" value="the-denver-post-editorial-board" type="hidden">');
        }

        function addOpinionauthor() {
            jQuery('#coauthors_hidden_input').remove();
            jQuery('.suggest.coauthor-row:first-child').append('<input id="coauthors_hidden_input" name="coauthors[]" value="dp-opinion" type="hidden">');
        }

        function checkDPSPOnline() {
            document.getElementById('following_usergroups12195').checked = true;
        }

        function suggestSomeTags(tags) {
            tagsHTML = '<script>';
            tagsHTML += 'function slugItUp(inText) {';
            tagsHTML += 'return inText.toLowerCase().replace(/[^\\\w\ ]+/g,\'\').replace(/ +/g,\'-\');';
            tagsHTML += '}';
            tagsHTML += 'function stripslashes(str) {';
            tagsHTML += 'str = str.replace(/\\\\\'/g, \'\\\'\');';
            tagsHTML += 'str = str.replace(/\\\\"/g, \'"\');';
            tagsHTML += 'str = str.replace(/\\\\0/g, \'\\0\');';
            tagsHTML += 'str = str.replace(/\\\\\\\\/g, \'\\\\\');';
            tagsHTML += 'return str;';
            tagsHTML += '}';
            tagsHTML += 'function addSuggestedTag(newSuggestedTag) {';
            tagsHTML += 'document.getElementById(\'new-tag-post_tag\').value = stripslashes(newSuggestedTag);';
            tagsHTML += 'jQuery(\'#post_tag .ajaxtag input.button.tagadd\').click();';
            tagsHTML += 'var delTag = \'#tagSuggest_\' + slugItUp(newSuggestedTag);';
            tagsHTML += 'jQuery(delTag).remove();';
            tagsHTML += '}';
            tagsHTML += 'function closeSuggestedTags() {';
            tagsHTML += 'jQuery(\'#autoProducerSuggestedTags\').remove();';
            tagsHTML += '}';
            tagsHTML += 'jQuery(\'body, html\').animate({ scrollTop: jQuery(\'#autoProducerSuggestedTags\').offset().top - 70 }, \'fast\');';
            tagsHTML += '</script>';
            tagsHTML += '<div style="width:88%;padding:.5em 1em;border:1px solid DarkRed;font-size:1em;color:DarkRed;" id="autoProducerSuggestedTags">';
            tagsHTML += '<p style="color:black;font-size:1.1em;">I have some suggested tags for you -- click to add them!</p>';
            tagsHTML += '<ul style="list-style-type:none;text-indent:none;font-size:1.2em;">';
            for (var i=0,len=tags.length;i<len;i++){
                var slug = slugItUp(tags[i]);
                tagsHTML += '<li id="tagSuggest_'+slug+'" onClick="javascript:addSuggestedTag(\''+addslashes(tags[i])+'\')" style="cursor:pointer;margin:0 0 .25em;padding:0;">+ '+tags[i]+'</li>';
            }
            tagsHTML += '</ul>';
            tagsHTML += '<p style="color:black;margin-top:1em;font-size:1.1em;text-align:right;cursor:pointer;" onClick="javascript:closeSuggestedTags();"><strong>Close</strong></p>';
            tagsHTML += '</div>';
            jQuery('#tagsdiv-post_tag .inside').prepend(tagsHTML);
        }

        function trumpThatBitch(options,args) {
            var contentArgs = [];
            contentArgs.wire = true;
            contentArgs.topGrafAdd = false;
            if (typeof args.WaPoauthorSelect != 'undefined' && args.WaPoauthorSelect === true) {
                addWaPoauthor();
            }
            if (typeof args.APauthorSelect != 'undefined' && args.APauthorSelect === true) {
                addAPauthor();
            }
            if ((typeof options.related != 'undefined' && options.related === true) || args.selectRelated === true) {
                contentArgs.related = true;
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('94') > -1) {
                checkDPSPOnline();
                contentArgs.newsletterDefault = '2';
                contentArgs.appPromoSports = true;
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('97') > -1) {
                contentArgs.newsletterDefault = '3';
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('53') > -1) {
                contentArgs.newsletterDefault = '4';
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('9101') > -1) {
                contentArgs.newsletterDefault = '5';
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('27') > -1) {
                contentArgs.newsletterDefault = '6';
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('75') > -1) {
                contentArgs.newsletterDefault = '7';
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('112') > -1) {
                contentArgs.newsletterDefault = '9';
                contentArgs.prepSider = true;
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('114') > -1) {
                contentArgs.newsletterDefault = '10';
                contentArgs.rockies = true;
            }
            if (typeof options.title != 'undefined' && options.title == 'Weather Story') {
                contentArgs.wx = true;
            }
            if (typeof options.title != 'undefined' && options.title == 'Recipes') {
                contentArgs['rel-section'] = true;
            }
            if (args.crimeMapSelect && !args.homicideSelect) {
                contentArgs.crime = true;
            }
            if (args.closureSelect) {
                contentArgs.closures = true;
            }
            if (args.homicideSelect) {
                contentArgs.homicide = true;
            }
            if (args.hateSelect) {
                contentArgs.hate = true;
            }
            // if (args.supportSelect) {
            //     contentArgs.support = true;
            // }
            if (args.ethicsSelect) {
                contentArgs.ethics = true;
            }
            if (args.youtubeSelect) {
                contentArgs.youtube = true;
            }
            if (args.newsletterSelect) {
                contentArgs.newsletter = true;
            }
            if (args.fullBleedSelect) {
                contentArgs.fullbleed = true;
            }
            if (args.doubleQuotesSelect) {
                contentArgs.doubleQuotes = true;
            }
            if (args.appPromo) {
                contentArgs.appPromo = true;
            }
            if (args.promoSelect) {
                contentArgs.promos = true;
            }
            if (args.officerShootingSelect){
                contentArgs.officerMap = true;
            }
            if (args.realEstateSelect){
                contentArgs.realestateMap = true;
            }
            if (args.oilGasSelect){
                contentArgs.oilMap = true;
            }
            if (args.wildfireSelect){
                contentArgs.wildfireMap = true;
            }
            if (args.homicideSelect){
                contentArgs.homicideMap = true;
            }
            if (args.rockiesGeneral){
                contentArgs.rockiesGeneral = true;
            }
            if (args.rockiesScoreboard){
                contentArgs.rockiesScoreboard = true;
            }
            if (args.nlwestStandings){
                contentArgs.nlwestStandings = true;
            }
            if (args.rockiesSchedule){
                contentArgs.rockiesSchedule = true;
            }
            if (args.rockiesLeaders){
                contentArgs.rockiesLeaders = true;
            }
            if (args.rockiesOffense){
                contentArgs.rockiesOffense = true;
            }
            if (args.rockiesDefense){
                contentArgs.rockiesDefense = true;
            }
            if (args.mlbHomeRUnLeaders){
                contentArgs.mlbHomeRUnLeaders = true;
            }
            if (args.broncosGeneral){
                contentArgs.broncosGeneral = true;
            }
            if (args.avalancheGeneral){
                contentArgs.avalancheGeneral = true;
            }
            if (args.nuggestGeneral){
                contentArgs.nuggestGeneral = true;
            }
            if (args.domesticViolence){
                contentArgs.domesticViolence = true;
            }
            if (args.alzheimer){
                contentArgs.alzheimer = true;
            }
            if (args.suicideResources){
                contentArgs.suicideResources = true;
            }
            if (args.avalancheDanger){
                contentArgs.avalancheDanger = true;
            }
            if (args.relatedSelect){
                contentArgs.relatedSelect = true;
            }
            if (options.title.indexOf('Opinion') !== -1) {
                contentArgs.opinion = true;
                uncheckLatestSection();
                uncheckAppleNewsNews();
                contentArgs.newsletterDefault = '8';
            }
            if (options.title.indexOf('Opinion: Letter') !== -1) {
                addOpinionauthor();
            }
            if (options.title.indexOf('Opinion: Editorial') !== -1) {
                addEditorialauthor();
            }
            if (options.title == 'YourHub Crime Blotter') {
                contentArgs['related-override'] = true;
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';
            }
            if (options.title == 'Health') {
                contentArgs.bottomGrafAdd = '<em><a href="https://extras.denverpost.com/newsletters/"><strong>Subscribe to bi-weekly newsletter to get health news sent straight to your inbox.</strong></a></em>';
            }
            if (options.title == 'Coronavirus') {
                contentArgs.virus = true;
            }
            if (typeof options['check-sections'] != 'undefined' && options['check-sections'].indexOf('110') > -1) {
                contentArgs.olymPlug = true;
            }
            if (options['primary-tag'] == '15947') {
                // ADD TOPPER STUFF
                contentArgs.topGrafAdd = '<img class="aligncenter lazyload size-article_inline" alt="The Field House. College Sports coverage from The Denver Post." data-sizes="auto" data-src="https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/field-house-banner.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1" data-srcset="https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/field-house-banner.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 620w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/field-house-banner.jpg?w=780&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 780w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/field-house-banner.jpg?w=810&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 810w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/field-house-banner.jpg?w=630&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 630w" />' +
                    '<em><strong><a href="https://www.denverpost.com/tag/the-field-house/"> The Field House</a>.</strong> College Sports coverage from The Denver Post\'s Kyle Fredrickson.</em>'+
                    '<hr>';
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';   
            }
            if (options.title.indexOf('Insider: Basketball') !== -1) {
                contentArgs.topGrafAdd = '<a href="https://www.denverpost.com/tag/post-preps-insider/"><img class="aligncenter lazyload size-article_inline" alt="Post Preps Insider" data-src="https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1" data-srcset="https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 620w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider.jpg?w=780&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 780w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider.jpg?w=810&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1810w,https://i2.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider.jpg?w=630&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 630w" /></a>' +
                    '<em><a href="https://www.denverpost.com/tag/post-preps-insider/">Post Preps Insider</a> is your daily source for news, story lines, top games and more information on Colorado high school sports -- brought to you by Denver Post preps editor Kyle Newman.</em>'+
                    '<hr>';
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';
            }
            if (options.title.indexOf('Insider: Football') !== -1) {
                contentArgs.topGrafAdd = '<a href="https://www.denverpost.com/tag/post-preps-insider/"><img class="aligncenter lazyload size-article_inline" alt="Post Preps Insider" data-src="https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-football.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1" data-srcset="https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-football.jpg?w=620&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 620w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-football.jpg?w=780&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 780w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-football.jpg?w=810&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 810w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-football.jpg?w=630&amp;crop=0%2C0px%2C100%2C9999px&amp;ssl=1 630w" /></a>' +
                    '<em><a href="https://www.denverpost.com/tag/post-preps-insider/">Post Preps Insider</a> is your daily source for news, story lines, top games and more information on Colorado high school sports -- brought to you by Denver Post preps editor Kyle Newman.</em>'+
                    '<hr>';
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';
            }
            if (options.title.indexOf('Insider: Baseball') !== -1) {
                contentArgs.topGrafAdd = '<a href="https://www.denverpost.com/tag/post-preps-insider/"><img alt="Post Preps Insider" class="aligncenter lazyload size-article_inline" data-src="https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-baseball-softball.jpg?w=620&#038;crop=0%2C0px%2C100%2C9999px&#038;ssl=1" data-srcset="https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-baseball-softball.jpg?w=620&#038;crop=0%2C0px%2C100%2C9999px&#038;ssl=1 620w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-baseball-softball.jpg?w=780&#038;crop=0%2C0px%2C100%2C9999px&#038;ssl=1 780w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-baseball-softball.jpg?w=810&#038;crop=0%2C0px%2C100%2C9999px&#038;ssl=1 810w,https://i0.wp.com/www.denverpost.com/wp-content/uploads/2018/01/post-preps-insider-baseball-softball.jpg?w=630&#038;crop=0%2C0px%2C100%2C9999px&#038;ssl=1 630w"></a>' +
                    '<em><a href="https://www.denverpost.com/tag/post-preps-insider/">Post Preps Insider</a> is your daily source for news, story lines, top games and more information on Colorado high school sports -- brought to you by Denver Post preps editor Kyle Newman.</em>'+
                    '<hr>';
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';
            }
            if (options.title == 'Hero Sports Story') {
                console.log('inside hero sports story fixes');
                //hero sports customizations
                document.getElementById('fm-mason_post_settings-0-schema-0-featured_image_settings-0').value = 'hide';
                jQuery('#tagsdiv-feature .tagchecklist > li').each(function () {
                    var tempTag = jQuery(this).clone().children().remove().end().text();
                    if (tempTag.match(/Twitter/)) {
                        //alert("got twitter");
                        //we have to actually click the button because WP ajax's this, and doens't update on article update
                        $(this).find('button').click();
                    }
                });
                //set featured image to one of these random image ID's from WP
                var heroFeaturedImages = ["3655034", "3655035", "3655030", "3657516", "3657517", "3657515"];
                var selectHeroImage = heroFeaturedImages[Math.floor(Math.random() * heroFeaturedImages.length)];
                //empty add photo div and refill with the content below
                jQuery('#set-post-thumbnail').empty();
                //this is what actually saves the image to WP
                jQuery('#_thumbnail_id').val(selectHeroImage);
                console.log("we selected this photo:"+selectHeroImage);
                //show the correct thumb based on random hero image choosen
                switch (selectHeroImage) {
                    case '3655034':
                        jQuery('#set-post-thumbnail').append("<img src='https://i2.wp.com/www.denverpost.com/wp-content/uploads/2019/09/TDP-L-football-preview-KEB-0687.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                    case '3655035':
                        jQuery('#set-post-thumbnail').append("<img src='https://i0.wp.com/www.denverpost.com/wp-content/uploads/2019/09/TDP-L-gentry-prep-preview-KEB-0046.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                    case '3655030':
                        jQuery('#set-post-thumbnail').append("<img src='https://i1.wp.com/www.denverpost.com/wp-content/uploads/2019/09/Caliche_homecoming_rj_13670.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                    case '3657516':
                        jQuery('#set-post-thumbnail').append("<img src='https://i1.wp.com/www.denverpost.com/wp-content/uploads/2019/09/SCHSFB_MJ14104.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                    case '3657517':
                        jQuery('#set-post-thumbnail').append("<img src='https://i1.wp.com/www.denverpost.com/wp-content/uploads/2019/09/SCHSFOOT2022.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                    case '3657515':
                        jQuery('#set-post-thumbnail').append("<img src='https://i0.wp.com/www.denverpost.com/wp-content/uploads/2019/09/7080699.jpg?w=266&crop=0%2C0px%2C100%2C266px&ssl=1'>");
                        break;
                }
                //add the remove image button and text
                jQuery('#postimagediv').append("<p class=\"hide-if-no-js howto\" id=\"set-post-thumbnail-desc\">Click the image to edit or update</p><p class=\"hide-if-no-js\"><a href=\"#\" id=\"remove-post-thumbnail\">Remove featured image</a></p>");
                //uncheck notify sports team
                document.getElementById('following_usergroups12195').checked = false;
            }
            if (typeof options['check-sections'] != 'undefined') {
                checkSections(options['check-sections']);
            }
            if (typeof options['notifications'] != 'undefined') {
                setNotification(options['notifications']);
            }
            if (typeof options['trust'] != 'undefined') {
                checkTrustSections(options['trust']);
            }
            if (typeof options['add-tags'] != 'undefined') {
                addTag(options['add-tags']);
            }
            if (typeof options.features != 'undefined') {
                addFeatures(options.features);
            }
            if (typeof options['primary-section'] != 'undefined' || typeof options['primary-tag'] != 'undefined') {
                primaryOptions(options['primary-section'],options['primary-tag']);
            }
            if (typeof options['apple-news'] != 'undefined') {
                //remove later apple news is gone.
               // checkAppleNewsBoxes(options['apple-news']);
            }
            if (typeof options['sendtonews'] != 'undefined') {
                sendtonews();
            }
            var tagsSuggested = processContent(contentArgs);
            suggestSomeTags(tagsSuggested);
        }

        function processContent(args) {
            String.prototype.capitalizeFirstLetters = function() {
                var words = this.replace(/,(?=[^\s])/g, ", ").split(/[\s]+/);
                var wordsOut = [];
                for(i=0,len=words.length;i<len;i++) {
                    if (words[i].toLowerCase() == 'and') {
                        wordsOut.push(words[i].toLowerCase());
                    } else {
                        wordsOut.push(words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase());
                    }
                }
                wordsOut = wordsOut.join(' ');
                if (wordsOut.match(/,\s*$/)) {
                    wordsOut = wordsOut.replace(/,\s*$/, "");
                }
                return wordsOut;
            };
            var excerpt = document.getElementById('excerpt').textContent;
            var newExcerpt = false;
            var content = document.getElementById('content');
            var relExists = false;
            autoProducerTagsToCheck = autoProducerAllTags.filter(function(val) {
                return autoProducerTagList.indexOf(val) == -1;
            });
            var tagLen = autoProducerTagsToCheck.length;
            var suggestedTags = [];
            var decodedContent = $('<textarea/>').html(content.textContent).text();
            var tagContent = decodedContent.toLowerCase();
            var articleTags = document.getElementById('post_tag').getElementsByTagName('button');
            var extantTags = [];
            for(i=0;i<articleTags.length;i++) {
                extantTags[i] = articleTags[i].textContent.toLowerCase().replace('remove term: ','');
            }
            function testTag(tagToTest) {
                var testPassed = false;
                if (testPassed == false && tagToTest.split(" ").length > 3) {
                    tagsToTest = tagToTest.split(" ");
                    for (i=0;i<tagsToTest.length-2;i++) {
                        if (testPassed == false && tagsToTest[i].length > 3 && tagsToTest[i+1].length > 3 && tagsToTest[i+2].length > 3) {
                            var testTermLong = tagsToTest[i] + ' ' + tagsToTest[i+1] + ' ' + tagsToTest[i+2];
                            testPassed = new RegExp("\\b"+testTermLong+"\\b").test(tagContent);
                        }
                    }
                }
                if (testPassed == false) {
                    RegExp.escape = function (value) {
                        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
                    };
                    tagToTest = RegExp.escape(tagToTest);
                    testPassed = new RegExp("\\b"+tagToTest+"\\b").test(tagContent);
                }
                return testPassed; 
            }
            while(tagLen-- && tagLen >= 0) {
                var thisTag = autoProducerTagsToCheck[tagLen];
                var thisTagLower = autoProducerTagsToCheck[tagLen].toLowerCase().replace(/ *\([^)]*\) */g, "");
                if (testTag(thisTagLower) && extantTags.indexOf(thisTagLower) == -1 && suggestedTags.indexOf(thisTagLower) == -1) {
                    suggestedTags.push(thisTag);
                }
            }
            var splitters = /\n\n|<\/p><p>|<\/p>\n<p>|[\s]{2,5}<p>|<p>|<\/p> <p>|<\/p> <p \/> <p>/;
            var grafs = decodedContent.split(splitters);
            if (grafs[0].toLowerCase().startsWith('by') || grafs[0].toLowerCase().startsWith('[caption') || grafs[0].toLowerCase().startsWith('<strong>by')) {
                if (grafs[1].toLowerCase().startsWith('by') || grafs[1].toLowerCase().startsWith('[caption') || grafs[0].toLowerCase().startsWith('<strong>by')) {
                    newExcerpt = stripTheHTML(grafs[2].replace(/\[.+\]/g,''));    
                } else {
                    newExcerpt = stripTheHTML(grafs[1].replace(/\[.+\]/g,''));
                }
            } else {
                newExcerpt = stripTheHTML(grafs[0].replace(/\[.+\]/g,''));
            }
            var grafsClean = [];
            for(i=0,len=grafs.length;i<len;i++) {
                grafs[i] = fixPounds(grafs[i]);
                //finding placement for end of article content
                var placeWidget = (grafsClean.length-4 < 2) ? 1 : ((grafsClean.length < 24) ? 11 : grafsClean.length-4);
                if (grafs[i].match(/\[related_articles/) !== null) {
                    relExists = true;
                }
                //fix full bleed if selected
                if (args.fullbleed){
                    if (grafs[i].match(/\[caption/) !== null) {
                        //checking for caption type image
                        grafsClean.push( grafs[i].replace(/w=/g,"fit=").replace(/crop=[^&]*&/g,'') );
                        grafs[i] = '';
                    }else{
                        if (grafs[i].match(/\<img class="aligncenter  size-article_fullbleed lazyautosizes lazyload"/) !== null) {
                            //checking for regular non caption image center aligned
                            grafsClean.push( grafs[i].replace(/w=/g,"fit=").replace(/crop=[^&]*&/g,'') );
                            grafs[i] = '';
                        }else{
                            if (grafs[i].match(/\<img class="alignnone  size-article_fullbleed lazyautosizes lazyload"/) !== null) {
                                //checking for regular non caption image align-none alignment
                        grafsClean.push( grafs[i].replace(/w=/g,"fit=").replace(/crop=[^&]*&/g,'') );
                        grafs[i] = '';
                            }else{
                                if (grafs[i].match(/\<img class="size-article_fullbleed lazyautosizes lazyload alignnone"/) !== null) {
                                    //checking for regular non caption image no alignment tag
                                    grafsClean.push( grafs[i].replace(/w=/g,"fit=").replace(/crop=[^&]*&/g,'') );
                                    grafs[i] = '';
                                }else{
                                    /*
                                    if (grafs[i].match(/\<img class="alignleft  size-article_inline_half lazyautosizes lazyload"/) !== null) {
                                        //align left fix
                                        grafsClean.push( grafs[i].replace(/<img/,"<img style='width:70%;'") );
                                        grafs[i] = '';
                                    }else{
                                        if (grafs[i].match(/\<img class="alignright  size-article_inline_half lazyautosizes lazyload"/) !== null) {
                                            //align right fix
                                            grafsClean.push( grafs[i].replace(/<img/,"<img style='width:70%;'") );
                                            grafs[i] = '';
                                        }
                                    }
                                    */
                                }
                            }
                        }
                    }
                }
                if (grafs[i].match(/<p \/>/) === null && grafs[i].length > 0 && !(grafs[i].match(/&nbsp;/) && grafs[i].length < 7)) {
                    grafsClean.push(grafs[i].replace('</p>','').replace('&#8212;','--').replace('—','--').replace('(AP) ',''));
                }

            }
            if (args.virus){
                var relPlace = (grafsClean.length-4 < 4) ? 3 : ((grafsClean.length > 24) ? grafsClean.length-4 : 11 );
                var coronavirusContent = '<a href="https://www.denverpost.com/newsletter-signup/checkup-denver"><img class="alignright size-article_inline_half lazyautosizes lazyload" src="https://www.denverpost.com/wp-content/uploads/2020/07/Checkup-Denver-3.gif" /></a>';
                grafsClean.splice(relPlace, 0, coronavirusContent);
                var coronavirusFacebook = '<em><a href="https://www.facebook.com/groups/638279553627526/"><strong>Join our Facebook group for the latest updates on coronavirus in Colorado.</strong></a></em>';
                grafsClean.splice(grafsClean.length, 0, coronavirusFacebook);
            }
            if (args.wire) {                
                if (grafsClean[0].toLowerCase().startsWith('by')) {
                    var byline = grafsClean[0];
                    var bylineSplit = '';
                    var author = document.getElementById('coauthors_hidden_input').value;
                    if (byline.toLowerCase() == 'by the associated press') {
                        bylineSplit = 'APonly';
                    } else {
                        var index = byline.lastIndexOf(',');
                        if (byline.indexOf('(c)') > -1) {
                            bylineSplit = byline.split('(c)')[0].substr(0,index).capitalizeFirstLetters().replace('By ','').trim();
                        } else if (author != 'the-associated-press') {
                            bylineSplit = byline.substr(0,index).capitalizeFirstLetters().replace('By ','');
                        } else {
                            bylineSplit = byline.capitalizeFirstLetters().replace('By ','');
                        }
                    }
                    if (author == 'the-associated-press') {
                        if (bylineSplit == 'APonly') {
                            grafsClean.shift();
                        } else {
                            grafsClean[0] = '<strong>By ' + bylineSplit + '</strong>, <em>The Associated Press</em>';
                        }
                    } else if (author == 'the-washington-post') {
                        grafsClean[0] = '<strong>By ' + bylineSplit + '</strong>, <em>The Washington Post</em>';
                    }
                }
                if (excerpt.length < 10) {
                    excerpt = newExcerpt;
                }
                var excerptDateline = (excerpt.indexOf('(AP) —') > -1) ? excerpt.substring(0,excerpt.indexOf('(AP) —')) : excerpt.substring(0,excerpt.indexOf('(AP) &#8212;'));
                var newExcerptText = excerpt.replace(excerptDateline,'').replace('&#8212;','--').replace('—','--').replace('(AP) --','').trim();
                document.getElementById('excerpt').value = newExcerptText;
                if (document.getElementById('wp_seo_meta_description').value == '') {
                    document.getElementById('wp_seo_meta_description').value = newExcerptText;
                }
            }
            //&& !relExists add this if you want to check for [related 
            if (args.relatedSelect ){
                //add new related tag if related isn't already there
                grafsClean.splice(5, 0, '<p style="font-style:italic;border-left:7px solid #8e1024;margin-left:15px;margin-top:10px;cursor:pointer;padding-left:8px"><strong>RELATED:</strong> <a href="'+relatedURL+'">'+relatedText+'</a>\n</p>');
            }
            //related bar (not currated)
            if (args.related && !relExists) {
                var relPlace = (grafsClean.length-4 < 2) ? 1 : ((grafsClean.length > 24) ? 11 : grafsClean.length-4);
                if (grafsClean.length >= 4 || args['related-override']) {
                    grafsClean.splice(relPlace, 0, '[related_articles location="right" show_article_date="false" article_type="automatic-primary-tag"]');
                } else if (args['rel-section']) {
                    grafsClean.splice(relPlace, 0, '[related_articles location="right" show_article_date="false" article_type="automatic-primary-section"]');
                }
            }
            if (args.wx) {
                grafsClean.splice(3, 0, '[cq comment="ASIDE PLACED BELOW"]\n<aside class=\'related alignright\'> [dfm_iframe src=\'https://extras.denverpost.com/weather/widget-iframe.html\' width=\'300px\' height=\'590px\'] </aside>[cq comment="ASIDE PLACED ABOVE"]');
            }
            if (args.hate) {
                grafsClean.splice(7, 0, '[cq comment="ASIDE PLACED BELOW"]\n<aside class="related left alignleft">\n<h2 class="widget-title">Documenting Hate</h2>\n<div style="width:100%;"><a href="https://extras.denverpost.com/documenting-hate/"><img src="https://www.denverpost.com/wp-content/uploads/2017/06/hate-speech-vandalism.jpg" alt="Documenting Hate project submissions" style="width:90%;margin:0 auto;"></a></div>\n<p>Share your stories of hate crimes and discrimination with The Denver Post and ProPublica <a href="https://extras.denverpost.com/documenting-hate/">through the nationwide Documenting Hate project</a>.</p>\n</aside>\n[cq comment="ASIDE PLACED ABOVE"]');
            }
            if (args.prepSider) {
                //removed because we have no prpes stats anymore. but left here so we can add something if we want.
                //grafsClean.splice(4, 0, '<aside class="related right"> <h2 class="widget-title"><a href="http://preps.denverpost.com/"">Colorado Prep Stats</a></h2>[dfm_iframe src="http://preps.denverpost.com/sidebar_lg.html" width="300px" height="400px" scrolling="no"]</aside>');
            }
            if (args.olymPlug) {
                var olyPlug = '<aside class="related left alignleft">' +
                    '<h2 class="widget-title">Let\'s Talk Olympics</h2>' +
                    '<p><a href="https://www.facebook.com/groups/dpolympics"><img src="https://www.denverpost.com/wp-content/uploads/2018/02/olympic-fb-tease.jpg" style="width: 94%;margin-left: 3%"></a></p>' +
                    '<p>Do you love watching the Olympics? Come <a href="https://www.facebook.com/groups/dpolympics">talk about the Games with us on our exclusive Facebook group</a>.</p>' +
                    '</aside>';
                grafsClean.splice(7, 0, olyPlug);
            }
            if (args.closures) {
                grafsClean.splice(2, 0, '<aside class="related alignright">[dfm_iframe src="https://extras.denverpost.com/weather-closures/school-closures.html#iframe" width="100%" height="500px"]</aside>');
            }
            if (args.topGrafAdd) {
                grafsClean.splice(0, 0, args.topGrafAdd);
            }
            if (args.bottomGrafAdd){
                grafsClean.push(args.bottomGrafAdd);
            }
            if (args.crime && !args.wx) {
                var crimemap = {
                    neighborhoods: Array('Wellshire',  'CBD',  'University Hills',  'Overland',  'Speer',  'Gateway / Green Valley Ranch',  'Ruby Hill',  'Marston',  'North Capitol Hill',  'City Park',  'Indian Creek',  'Five Points',  'Sun Valley',  'Westwood',  'Cole',  'Washington Park West',  'Platt Park',  'Harvey Park South',  'Villa Park',  'Athmar Park',  'Skyland',  'North Park Hill',  'Sunnyside',  'Southmoor Park',  'Jefferson Park',  'Capitol Hill',  'Windsor',  'Barnum West',  'Virginia Village',  'Montbello',  'Bear Valley',  'Goldsmith',  'Stapleton',  'Chaffee Park',  'Cory-Merrill',  'Northeast Park Hill',  'Union Station',  'Washington Park',  'Barnum',  'Elyria-Swansea',  'Civic Center',  'Hampden South',  'Globeville',  'City Park West',  'Clayton',  'Cheesman Park',  'Country Club',  'Hale',  'Mar Lee',  'Lincoln Park',  'Berkeley',  'West Highland',  'Harvey Park',  'Regis',  'East Colfax',  'Whittier',  'Belcaro',  'Hampden',  'Fort Logan',  'College View / South Platte',  'West Colfax',  'Baker',  'Kennedy',  'Cherry Creek',  'DIA',  'Congress Park',  'South Park Hill',  'Rosedale',  'Valverde',  'Lowry Field',  'Washington Virginia Vale',  'Auraria',  'Hilltop',  'Highland',  'Montclair',  'University',  'University Park',  'Sloan Lake'),
                    get_markup: function() {
                        if ( this.type == '1' ) {
                            return '[cq comment="ASIDE PLACED BELOW"]\n<aside class="related right alignright">\n' +
                            '<h2 class="widget-title"><a href="https://crime.denverpost.com/">Denver Crime</a></h2>\n' +
                            '<p>See our <a href="https://crime.denverpost.com/neighborhood/' + this.slug + '/">index of reported crimes in Denver\'s ' + this.neighborhood + ' neighborhood</a>.</p>\n' +
                            '<p><strong>Also,</strong> ' + this.get_random_feature() + '.</p>\n' +
                            '</aside>[cq comment="ASIDE PLACED ABOVE"]';
                        }
                        else if ( this.type === '' ) {
                            return '[cq comment="ASIDE PLACED BELOW"]\n<aside class="related right alignright">\n' +
                            '<h2 class="widget-title"><a href="https://crime.denverpost.com/">Denver Crime</a></h2>\n' +
                            '<div style="width:100%;height: 150px;overflow:hidden"><a href="https://crime.denverpost.com/crime/' + this.slug + '/"><img src="' + this.get_random_image() + '" alt="Denver crime map" width="100%" style="width:100%;margin-top:-40px"></a></div>\n' +
                            '<p>See our <a href="https://crime.denverpost.com/crime/' + this.slug + '/">map, report and neighborhood rankings of ' + this.crime + ' in Denver</a>.</p>\n' +
                            '<p><strong>Also,</strong> ' + this.get_random_feature() + '.</p>\n' +
                            '</aside>[cq comment="ASIDE PLACED ABOVE"]';
                        }
                    },
                    image_list: ['https://www.denverpost.com/wp-content/uploads/2017/01/denver-crime-map11.png', 'https://www.denverpost.com/wp-content/uploads/2017/01/denver-crime-map4.png', 'https://www.denverpost.com/wp-content/uploads/2017/01/denver-crime-map3.png', 'https://www.denverpost.com/wp-content/uploads/2017/01/denver-crime-map2.png', 'https://www.denverpost.com/wp-content/uploads/2016/10/denver-crime-map.png'],
                    get_random_image: function() {
                        var ceiling = this.image_list.length;
                        var index = Math.floor(Math.random() * ceiling);
                        return this.image_list[index];
                    },
                    feature_list: [{'compare crime rates across Denver neighborhoods': 'https://crime.denverpost.com/neighborhood/compare/'}, {'see our Denver crime map': 'https://crime.denverpost.com/map/'}, {'see the Denver-city crime report': 'https://crime.denverpost.com/city/'}, {'see our list of neighborhood crime reports': 'https://crime.denverpost.com/neighborhood/'}],
                    get_random_feature: function () {
                        // Pull a random item from this.feature_list
                        var ceiling = this.feature_list.length;
                        var index = Math.floor(Math.random() * ceiling);
                        var item = this.feature_list[index];
                        var key = Object.keys(item)[0];
                        return '<a href="' + item[key] + '">' + key + '</a>';
                    },
                    get_type: function () {
                        this.type = prompt('Enter 1 for a neighborhood crime promo or hit enter for a crime-specific promo');
                        return this.type;
                    },
                    get_neighborhood: function(message) {
                        message = (typeof message == 'undefined') ? '' : message;
                        this.neighborhood = prompt(message + 'Type in the name of the neighborhood');
                        if ( this.neighborhoods.indexOf(this.neighborhood) === -1 ) {
                            if ( message === '' ) this.get_neighborhood("That's not a valid neighborhood\n");
                            else this.get_neighborhood("This is a list of valid neighborhoods: " + this.neighborhoods.join(", "));
                        }
                        this.slug = this.slugify(this.neighborhood);
                    },
                    get_crime: function() {
                        crime_id = prompt('Hit enter for Violent Crimes, type 1 for Assaults, 2 for Bank Robberies, 3 for Bike Thefts, 4 for Burglaries, 5 for Car Thefts, 6 for DUIs, 7 for hit and runs, 8 for Domestic Violence, 9 for Homicides, 10 for Property Crimes, 11 for Sexual Assault, 12 for Rape, 13 for Robberies, 14 for Drug & Alcohol, 15 for Larceny');
                        this.crime = 'violent crimes'; this.slug = 'violent';
                        if ( crime_id.indexOf('10') >= 0 ) { this.crime = 'property crimes'; this.slug = 'property'; }
                        else if ( crime_id.indexOf('11') >= 0 ) { this.crime = 'sexual assaults'; this.slug = 'sexual-assault'; }
                        else if ( crime_id.indexOf('12') >= 0 ) { this.crime = 'rapes'; this.slug = 'sexual-assault/rape'; }
                        else if ( crime_id.indexOf('13') >= 0 ) { this.crime = 'robberies'; this.slug = 'robbery'; }
                        else if ( crime_id.indexOf('14') >= 0 ) { this.crime = 'drug and alcohol crimes'; this.slug = 'drug-alcohol'; }
                        else if ( crime_id.indexOf('15') >= 0 ) { this.crime = 'larceny'; this.slug = 'larceny'; }
                        else if ( crime_id.indexOf('16') >= 0 ) { this.crime = ''; this.slug = ''; }
                        else if ( crime_id.indexOf('17') >= 0 ) { this.crime = ''; this.slug = ''; }
                        else if ( crime_id.indexOf('18') >= 0 ) { this.crime = ''; this.slug = ''; }
                        else if ( crime_id.indexOf('19') >= 0 ) { this.crime = ''; this.slug = ''; }
                        else if ( crime_id.indexOf('20') >= 0 ) { this.crime = ''; this.slug = ''; }
                        else if ( crime_id.indexOf('1') >= 0 ) { this.crime = 'assaults'; this.slug = 'assault'; }
                        else if ( crime_id.indexOf('2') >= 0 ) { this.crime = 'bank robberies'; this.slug = 'robbery/robbery-bank'; }
                        else if ( crime_id.indexOf('3') >= 0 ) { this.crime = 'bike thefts'; this.slug = 'theft-bicycle'; }
                        else if ( crime_id.indexOf('4') >= 0 ) { this.crime = 'burglaries'; this.slug = 'burglary'; }
                        else if ( crime_id.indexOf('5') >= 0 ) { this.crime = 'car thefts'; this.slug = 'auto-theft'; }
                        else if ( crime_id.indexOf('6') >= 0 ) { this.crime = 'DUIs'; this.slug = 'traffic-accident-dui-duid'; }
                        else if ( crime_id.indexOf('7') >= 0 ) { this.crime = 'hit-and-runs'; this.slug = 'traffic-accident-hit-and-run'; }
                        else if ( crime_id.indexOf('8') >= 0 ) { this.crime = 'domestic violence'; this.slug = 'dv'; }
                        else if ( crime_id.indexOf('9') >= 0 ) { this.crime = 'homicides'; this.slug = 'homicide'; }
                    },
                    init: function () {
                        if ( grafsClean.length > 5 ) this.pos = grafsClean.length - 3;

                        if ( this.get_type() == '1' ) this.get_neighborhood();
                        else this.get_crime();

                        grafsClean.splice(this.pos, 0, this.get_markup());
                    },
                    slugify: function(str) {
                        // Cribbed from https://github.com/andrefarzat/slugify/blob/master/slugify.js
                        var from = 'àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;',
                        to = 'aaaaaeeeeiiiiooooouuuunc------';

                        var i = 0,
                            len = from.length;
                        
                        str = str.toLowerCase();

                        for ( ; i < len; i++ )
                        {
                            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                        }

                        return str.replace(/^\s+|\s+$/g, '') //trim
                            .replace(/[^-a-zA-Z0-9\s]+/ig, '')
                            .replace(/\s/gi, "-");
                        }
                    };
                    crimemap.init();
                }
                if (args.ethics) {
                    box_id = prompt('1 for Ethics Box -- 2 for Anonymous Source');
                    var ethicsBox = '';
                    if (box_id.indexOf('1') >= 0) {
                        ethicsBox = '<div class="related right" style="border:1px solid black;padding:10px;text-align:left"><div style="border:3px solid black;padding:15px"><div style="font-size:30px;text-align:center">We should be transparent.</div><p style="text-align;left">Our job is to intensely scrutinize the activities of others as watchdogs that challenge authority and give voice to the voiceless. Our own actions should withstand equally intense scrutiny.</p><div style="text-align:center;font-weight:bold"><a style="color:#8e1024" target="_blank" href="https://www.denverpost.com/ethics-policy/" rel="noopener noreferrer">Read about The Denver Post Ethics Policy.</a></div></div></div>'
                    }
                    if (box_id.indexOf('2') >= 0) {
                        ethicsBox = '<div class="related right" style="border:1px solid black;padding:10px;text-align:left"><div style="border:3px solid black;padding:15px"><div style="font-size:30px;text-align:center">We should be transparent.</div><p style="text-align;left">The Denver Post expects the information in its pages to be accurately attributed. Anonymous sources are a last resort.</p><div style="text-align:center;font-weight:bold"><a style="color:#8e1024" target="_blank" href="https://www.denverpost.com/anonymous-sources/" rel="noopener noreferrer">Read about The Denver Post Anonymous Sources Policy.</a></div></div></div>'
                    }
                    grafsClean.splice(2, 0, ethicsBox);
                }
            //not using remove later or replace
            // if (args.support) {
            //     var msgNum = Math.floor(Math.random() * 7) + 1;
            //     var markup = new Array();
            //     markup[1] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>The Denver Post needs your support.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=1-dp-needs-support&utm_campaign=support-message">Subscribe now for just 99 cents for the first month</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[2] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>Democracy depends on journalism, and journalists need your help. Support The Denver Post and get unlimited digital access &mdash; <br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=2-democracy&utm_campaign=support-message">the first month is just 99 cents</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[3] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>&ldquo;I never quarrel with a man who buys ink by the barrel,&rdquo; former Indiana Rep. Charles Brownson said of the press. But we need your help to keep up with the rising cost of ink.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=3-ink-barrel&utm_campaign=support-message">Get your first month for just 99 cents when you subscribe to The Post</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[4] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>Like this story? Help support more local  journalism.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=4-like-story&utm_campaign=support-message">Become a subscriber for only 99 cents for the first month</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[5] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>Reader support helps bring you quality local journalism like this. Please consider becoming a subscriber.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=5-reader-support&utm_campaign=support-message">Your first month is only 99 cents</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[6] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>Journalism doesn’t grow on trees. Please support The Denver Post.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=6-journalism-trees&utm_campaign=support-message">Become a subscriber for only 99 cents for the first month</a>.</em><strong></p>\n' +
            //     '</div>';
            //     markup[7] = '<div style="padding:1em;background-color:#f6e8e9;border-bottom:1px solid black;border-top:10px solid #8e1024;text-align:left;clear:both;">\n' +
            //     '<p><strong><em>Journalism isn’t free. Show your support of local news coverage by becoming a subscriber.<br /><a style="color:#590a17;" href="https://checkout.denverpost.com/nolanding/?2204&utm_medium=article-link&utm_source=7-journalism-isnt-free&utm_campaign=support-message">Your first month is only 99 cents</a>.</em><strong></p>\n' +
            //     '</div>';
            //     grafsClean.push(markup[msgNum]);
            // }
            if (args.youtube) {
                loop:
                while(true) {
                    var vidIdRaw = prompt('What is the YouTube ID or URL of the video you want to embed?\n\nNote: Embeds always appear at the top of a story, but can be moved with CTRL+X and CTRL+V\n\n','');
                    vidId = (vidIdRaw.match(/youtube/) !== null) ? vidIdRaw.replace('https://','').replace('http://','').replace('www.','').replace('youtube.com/','').replace('watch?v=','').replace('embed/','').replace('?autoplay=1') : vidIdRaw;
                    if (vidId.length >= 11 && vidId.match(/^[A-za-z0-9_-]+$/) !== null) {
                        break loop;
                    } else {
                        alert(vidId + ' is not a valid YouTube URL or ID. Try again.');
                    }
                }
                loop:
                while(true) {
                    var autoPlay = prompt('Should it Autoplay? (Hit ENTER for "NO")\n\n' +
                        'Options:\n\n' +
                            'No Autoplay: 0 or ENTER\n' +
                            'Autoplay: 1\n','0');
                    if (autoPlay === '0' || autoPlay === '1') {
                        break loop;
                    } else {
                        alert('You must enter 0 or 1.');
                    }
                }
                var markup = ( autoPlay == 1 ) ? '[dfm_iframe src="https://www.youtube.com/embed/' + vidId + '?autoplay=' + autoPlay + '" width="100%" advanced_fields="true" allowfullscreen="yes" scrolling="no" frameborder="0"/]' : 'https://www.youtube.com/watch?v=' +  vidId;
                grafsClean.splice(0, 0, markup);
            }
            if (args.opinion) {
                var markup = '<em>To send a letter to the editor about this article, submit <a href="https://www.denverpost.com/submit-letter/">online</a> or check out our <a href="https://www.denverpost.com/2013/07/09/submission-guidelines-and-contact-information/">guidelines</a> for how to submit by email or mail.</em>';
                grafsClean.push(markup);
            } /*
            if (args.newsletter) {
                var newsletters = {
                    '1': {
                        'which': 'news',
                        'name': 'Mile High Roundup'
                    },
                    '2': {
                        'which': 'sportsdaily',
                        'name': 'Sports Daily newsletter'
                    },
                    '3': {
                        'which': 'bronxinsider',
                        'name': 'Broncos Insider'
                    },
                    '4': {
                        'which': 'marijuana',
                        'name': 'Cannabist Newsletter'
                    },
                    '5': {
                        'which': 'theknow',
                        'name': 'entertainment, dining and things to do newsletter'
                    },
                    '6': {
                        'which': 'techplus',
                        'name': 'Tech+ newsletter'
                    },
                    '7': {
                        'which': 'politicsrdup',
                        'name': 'Politics (and beyond) newsletter'
                    },
                    '8': {
                        'which': 'soundoff',
                        'name': 'The Sound Off opinion newsletter'
                    },
                    '9': {
                        'which': 'bnpreps',
                        'name': 'Prep Tally newsletter'
                    },
                    '10': {
                        'which': 'bnrockies',
                        'name': 'Rockies Insider'
                    }
                };
                var newsletterPromptText = 'Which newsletter do you want to plug? (Hit ENTER for the Roundup)\n\n' +
                    'Options:\n\n';
                for(var object in newsletters){
                    if (newsletters.hasOwnProperty(object)) {
                        newsletterPromptText += '        ( ' + object + ' ) ' + newsletters[object].name + '\n';
                    }
                }
                newsletterPromptText += '\nEnter your selection:\n\n';
                var defaultNewsletter = (typeof args.newsletterDefault !== 'undefined') ? args.newsletterDefault : '1';
                loop:
                while(true) {
                    var newsletterId = prompt(newsletterPromptText,defaultNewsletter);
                    if (newsletters[newsletterId].which !== 'undefined') {
                        break loop;
                    } else {
                        alert('I\'m afraid I can\'t do that, Dave.');
                    }
                }
                var markup = '<aside>\n' +
'[dfm_iframe src="https://extras.denverpost.com/app/mailer-rules/email-signup.html?which=' + newsletters[newsletterId].which + '&name=' + encodeURIComponent(newsletters[newsletterId].name) + '" width="100%" height="120px"]\n' +
'</aside>';
                grafsClean.push(markup);
            } */
            if (args.appPromo) {
                /* var promoLogo = (args.newsletter) ? '' : '?logo=false';
                var connector = (args.newsletter) ? '?' : '&';
                var sportsPromo = (args.appPromoSports) ? connector + 'sports=true' : '';
                var markup = '<aside>\n' +
'[dfm_iframe src="https://extras.denverpost.com/app/mailer-rules/app-promo.html' + promoLogo + sportsPromo + '" width="100%" height="100px"]\n' +
'</aside>';
                grafsClean.push(markup);
            }
            if (args.promos) {
                var promos = [1,2,3,4,5].sort(function() { return 0.5 - Math.random(); });
                promos.pop(); promos.pop();
                var item = promos.pop();
                var editing = true;
                var ceiling = 10;
                if ( content.textContent.indexOf('in-article-promo') !== -1 ) {
                    promos = [];
                    item = undefined;
                }
                if ( typeof item !== 'undefined' ) {
                    var section_id = prompt('Select the type of news to insert:\n\n\n' +
                    'News:\n' +
                        '(1) Soft news, (2) Hard news, (18) Business, (17) Real estate, (19) Tech, (20) Featured homes, (15) General Politics, (24) Trump Admin., (23) Colo. Leg., (26) Colorado Cold Cases, (27) Top Workplaces\n\n' +
                    'Sports:\n' +
                        '(Enter) Sports, (3) Broncos, (4) Nuggets, (5) Rockies\n\n' +
                    'Features:\n' +
                        '(6) Entertainment, (7) Restaurants, (8) Food, (9) Ask Amy, (10) Books, (11) Movies, (12) Home & Garden, (16) Travel, (25) Lifestyle\n\n' +
                    'Misc:\n' +
                        '(13) YourHub, (14) Editorials, (21) Season to Share, (22) Stock Show, (420) Marijuana\n\n\n' +
                    'Selection:', '');
                    var section = 'sports';
                    if ( section_id.indexOf('420') >= 0 ) { section = 'marijuana'; item = 'map'; }
                    else if ( section_id.indexOf('10') >= 0 ) { section = 'books'; }
                    else if ( section_id.indexOf('11') >= 0 ) { section = 'movies'; }
                    else if ( section_id.indexOf('12') >= 0 ) { section = 'home-garden'; }
                    else if ( section_id.indexOf('13') >= 0 ) { section = 'yourhub'; }
                    else if ( section_id.indexOf('14') >= 0 ) { section = 'editorials'; }
                    else if ( section_id.indexOf('15') >= 0 ) { section = 'politics'; }
                    else if ( section_id.indexOf('16') >= 0 ) { section = 'travel'; }
                    else if ( section_id.indexOf('17') >= 0 ) { section = 'real-estate'; }
                    else if ( section_id.indexOf('18') >= 0 ) { section = 'business'; }
                    else if ( section_id.indexOf('19') >= 0 ) { section = 'tech'; }
                    else if ( section_id.indexOf('20') >= 0 ) { section = 'featured-homes'; }
                    else if ( section_id.indexOf('21') >= 0 ) { section = 'season-to-share'; }
                    else if ( section_id.indexOf('22') >= 0 ) { section = 'stock-show'; }
                    else if ( section_id.indexOf('23') >= 0 ) { section = 'colorado-legislature'; }
                    else if ( section_id.indexOf('24') >= 0 ) { section = 'trump-administration'; }
                    else if ( section_id.indexOf('25') >= 0 ) { section = 'lifestyle'; }
                    else if ( section_id.indexOf('26') >= 0 ) { section = 'colorado-cold-cases'; }
                    else if ( section_id.indexOf('27') >= 0 ) { section = 'top-workplaces'; }
                    else if ( section_id.indexOf('1') >= 0 ) { section = 'dont-miss'; }
                    else if ( section_id.indexOf('2') >= 0 ) { section = 'hard-news'; }
                    else if ( section_id.indexOf('3') >= 0 ) { section = 'broncos'; }
                    else if ( section_id.indexOf('4') >= 0 ) { section = 'nuggets'; }
                    else if ( section_id.indexOf('5') >= 0 ) { section = 'rockies'; }
                    else if ( section_id.indexOf('6') >= 0 ) { section = 'entertainment'; }
                    else if ( section_id.indexOf('7') >= 0 ) { section = 'restaurants'; }
                    else if ( section_id.indexOf('8') >= 0 ) { section = 'food'; }
                    else if ( section_id.indexOf('9') >= 0 ) { section = 'ask-amy'; }
                }
                var firstPromo = (args.crime || args.wx) ? 9 : 4;
                var nextPromo = (args.crime || args.wx) ? 20 : 17;
                if ( grafsClean.length > 12 ) {
                    grafsClean.splice(firstPromo, 0, '[dfm_iframe src=\'https://extras.denverpost.com/app/in-article-promo/' + section + '-' + item + '.html\' width=\'100%\' height=\'100px\']');
                    item = promos.pop();
                    if ( grafsClean.length > nextPromo ) {
                        grafsClean.splice(Math.floor(grafsClean.length/2) + 1, 0, '[dfm_iframe src=\'https://extras.denverpost.com/app/in-article-promo/' + section + '-' + item + '.html\' width=\'100%\' height=\'100px\' scrolling=\'no\']');
                        item = promos.pop();
                    }
                }
                if ( typeof item !== 'undefined' && grafsClean[grafsClean.length-1].indexOf('in-article') === -1 && !(args.newsletter) ) {
                    grafsClean.splice(grafsClean.length, 0, '[dfm_iframe src=\'https://extras.denverpost.com/app/in-article-promo/' + section + '-' + item + '.html\' width=\'100%\' height=\'100px\' scrolling=\'no\']');
                } */
            }
            if (args.homicide && !(args.crime || args.wx)) {
                grafsClean.splice(3, 0, '[cq comment="ASIDE PLACED BELOW"]\n<aside class=\'related alignright\'> <h2 class=\'widget-title\'><a href=\'/denver-homicides/\'>Homicide Report</a></h2>\n' +
'<div style="width:100%;height: 150px;overflow:hidden"><a href=\'/denver-homicides/\'><img src=\'https://www.denverpost.com/wp-content/uploads/2016/10/homicide-map-denver.png\' alt=\'Denver Homicide Map\' border=\'0\'></a></div> <p>Follow this year\'s <a href=\'/denver-homicides/\'>homicides in Denver</a>, and track the city\'s homicide rate. See also: <a href="https://crime.denverpost.com/map/">Denver crime map</a>.</p> </aside>\n[cq comment="ASIDE PLACED ABOVE"]');
            }

            if (args.officerMap){
                var map = '<hr> [dfm_iframe src="https://extras.denverpost.com/app/officer-involved-shootings/2020/" width="100%" height="1000px" allowfullscreen="yes" scrolling="yes" /]';
                grafsClean.push(map);
            }
            if (args.realestateMap){
                var map = '<hr> [dfm_iframe src="https://extras.denverpost.com/maps/business/2020/developments/" width="100%" height="1000px" allowfullscreen="yes" scrolling="yes" /]';
                grafsClean.push(map);
            }
            if (args.oilMap){
                var map = '<div class="size-article_fullbleed" style="padding: 0 15px 0 23px"> <hr> <p style="text-align:center;font-style:italic;"><a href="https://www.denverpost.com/colorado-oil-gas-well-permit-map/">Click here</a> to view the map on its own page.</p> <h2 style="margin:15px 0 15px 14px;font-size:1.6em;">Oil and gas well permit map</h2> [dfm_iframe src="http://extras.denverpost.com/maps/news/oil-gas/permits/" width="100%" height="1800px" allowfullscreen="yes" scrolling="yes" /] </div>';
                grafsClean.push(map);
            }
            if (args.wildfireMap){
                var map = '<div class="size-article_fullbleed" style="padding: 0 15px 0 23px"> <hr> <h3 style="margin-bottom: 7px">Wildfires in Colorado and the U.S.</h3> The map shows active wildfire locations in 2020. The map defaults to Colorado; to see all wildfires, click "U.S." in the view area. Click the map layers icon in the top right corner of the map to change map backgrounds and to toggle active and contained fires. Click a marker or perimeter for details. To view the full map and a table of all wildfires, <a href="https://www.denverpost.com/2018/06/05/wildfires-colorado-united-states-map/">click here</a>.[dfm_iframe src="https://extras.denverpost.com/app/wildfire/?view=colorado" width="100%" height="850px" allowfullscreen="yes" scrolling="no" /] <p style="font-size: .9rem;line-height: 19px;font-style: italic">*Data comes from two sources, <a href="https://www.geomac.gov/">GeoMAC</a> and <a href="https://inciweb.nwcg.gov/">InciWeb</a>, and could contain inconsistencies. Map by Kevin Hamm and Daniel J. Schneider.</p> </div>';
                grafsClean.push(map);
            }
            if (args.homicideMap){
                var map = '<div class="size-article_fullbleed" style="padding: 0 15px 0 23px"> <hr> <p style="text-align:center;font-style:italic;margin:15px 0 15px 0;"><a href=" https://www.denverpost.com/denver-homicides/">Click here</a> to view the Denver Homicide Report on its own page.</p> [dfm_iframe src="https://extras.denverpost.com/app/homicide-report/" width="100%" height="3700px" allowfullscreen="yes" scrolling="yes" /] </div>';
                grafsClean.push(map);
            }

            //SPORT EMBEDS
            if (args.rockiesGeneral){
                var map = '<aside class="related right"> <h2 class="widget-title"><a href="/sports/colorado-rockies/">Colorado Rockies</a></h2> <ul> <li><a href="https://stats.denverpost.com/baseball/mlb/scores"><span class="dfm-title">MLB scoreboard</span></a></li> <li><a href="https://stats.denverpost.com/baseball/mlb/standings"><span class="dfm-title">MLB standings</span></a></li> <li><a href="https://stats.denverpost.com/baseball/mlb/teamschedule/2956"><span class="dfm-title">Schedule</span></a></li> <li><a href="https://stats.denverpost.com/baseball/mlb/teamstatistics/2956"><span class="dfm-title">Colorado Rockies stats</span></a></li> <li><a href="https://www.denverpost.com/tag/rockies-mailbag/"><span class="dfm-title">Rockies Mailbag</span></a></li> <li><a href="https://www.denverpost.com/rockies-mailbag-form/"><span class="dfm-title">Ask mailbag questions</span></a></li> </ul> </aside>\n';
                grafsClean.push(map);
            }
            if (args.rockiesScoreboard){
                grafsClean.splice(5, 0, '[dfm_iframe style="height: 150px; width: 100%" src="http://stats.denverpost.com/sports-scores/TeamMatchup.aspx?TeamAbbr=COL&amp;League=MLB" frameborder="no" scrolling="no" ]\n');
            }
            if (args.nlwestStandings){
                grafsClean.splice(5, 0, '<aside class="related right">[dfm_iframe style="height: 150px; width: 100%" src="http://extras.denverpost.com/sports-widget/mlb-nl-west.html" frameborder="no" scrolling="no" ]</aside>\n');
            }
            if (args.rockiesSchedule){
                var map = '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-rockies/">Rockies Baseball</a></h2> <script> var head  = document.getElementsByTagName(\'head\')[0]; var link  = document.createElement(\'link\'); link.rel  = \'stylesheet\'; link.type = \'text/css\'; link.href = \'http://stats.denverpost.com/stylesheet\'; head.appendChild(link); </script> <script  src="http://stats.denverpost.com/brick/mlb/team/schedule?teamId=2956"></script> </aside>\n';
                grafsClean.push(map);
            }
            if (args.rockiesLeaders){
                var map = '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-rockies/">Rockies Baseball</a></h2> <script> var head  = document.getElementsByTagName(\'head\')[0]; var link  = document.createElement(\'link\'); link.rel  = \'stylesheet\'; link.type = \'text/css\'; link.href = \'http://stats.denverpost.com/stylesheet\'; head.appendChild(link); </script> <script  src="http://stats.denverpost.com/brick/mlb/team/leaders?teamId=2956"></script> </aside>\n';
                grafsClean.push(map);
            }
            if (args.rockiesOffense){
                var map = '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-rockies/">Rockies Baseball</a></h2> <script> var head  = document.getElementsByTagName(\'head\')[0]; var link  = document.createElement(\'link\'); link.rel  = \'stylesheet\'; link.type = \'text/css\'; link.href = \'http://stats.denverpost.com/stylesheet\'; head.appendChild(link); </script> <script  src="http://stats.denverpost.com/brick/mlb/team/offense?teamId=2956"></script> </aside>\n';
                grafsClean.push(map);
            }
            if (args.rockiesDefense){
                var map = '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-rockies/">Rockies Baseball</a></h2> <script> var head  = document.getElementsByTagName(\'head\')[0]; var link  = document.createElement(\'link\'); link.rel  = \'stylesheet\'; link.type = \'text/css\'; link.href = \'http://stats.denverpost.com/stylesheet\'; head.appendChild(link); </script> <script  src="http://stats.denverpost.com/brick/mlb/team/defense?teamId=2956"></script> </aside>\n';
                grafsClean.push(map);
            }
            if (args.mlbHomeRunLeaders){
                var map = '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-rockies/">Rockies Baseball</a></h2> <script> var head  = document.getElementsByTagName(\'head\')[0]; var link  = document.createElement(\'link\'); link.rel  = \'stylesheet\'; link.type = \'text/css\'; link.href = \'http://stats.denverpost.com/stylesheet\'; head.appendChild(link); </script> <script  src="http://stats.denverpost.com/brick/mlb/statistics/2016/hitter_mlb_hr_regular_1.html"></script> </aside>\n';
                grafsClean.push(map);
            }
            if (args.broncosGeneral){
                grafsClean.splice(5, 0, '<aside class="related right"> <h2 class="widget-title"><a href="/sports/denver-broncos/">Denver Broncos</a></h2> <ul> <li><a href="http://www.denverpost.com/sports/denver-broncos/"><span class="dfm-title">More Broncos news</span></a></li> <li><a href="https://stats.denverpost.com/football/nfl/scores"><span class="dfm-title">NFL scoreboard</span></a></li> <li><a href="https://stats.denverpost.com/football/nfl/standings"><span class="dfm-title">NFL standings</span></a></li> <li><a href="https://stats.denverpost.com/football/nfl/teamschedule/21"><span class="dfm-title">Denver Broncos schedule 2018</span></a></li> <li><a href="https://stats.denverpost.com/football/nfl/team/21"><span class="dfm-title">Denver Broncos stats and scores</span></a></li> <li><a href="https://stats.denverpost.com/football/nfl/teamroster/21"><span class="dfm-title">Denver Broncos roster</span></a></li> <li><a href="http://www.denverpost.com/tag/broncos-mailbag/"><span class="dfm-title">Broncos Mailbag</span></a></li> <li><a href="http://www.denverpost.com/broncos-mailbag-form/"><span class="dfm-title">Ask mailbag questions</span></a></li> </ul> </aside>\n');
            }
            if (args.avalancheGeneral){
                grafsClean.splice(5, 0, '<aside class="related right"><h2 class="widget-title"><a href="/sports/colorado-avalanche/">Colorado Avalanche</a></h2> <ul> <li><a href="http://stats.denverpost.com/sports-scores/Hockey-Scores-Matchups.aspx"><span class="dfm-title">NHL scoreboard</span></a></li> <li><a href="http://stats.denverpost.com/hockey/nhl-standings.aspx?page=/data/nhl/standings/2015-2016/league/standings.html"><span class="dfm-title">NHL standings</span></a></li> <li><a href="https://stats.denverpost.com/hockey/nhl/team/1"><span class="dfm-title">Colorado Avalanche stats, roster, schedule</span></a></li> <li><a href="http://www.denverpost.com/tag/avalanche-mailbag/"><span class="dfm-title">Avs Mailbag</span></a></li> <li><a href="http://www.denverpost.com/avs-mailbag-form/"><span class="dfm-title">Ask mailbag questions</span></a></li> </ul> </aside>\n');
            }
            if (args.nuggestGeneral){
                grafsClean.splice(5, 0, '<aside class="related right"><h2 class="widget-title"><a href="/sports/denver-nuggets/">Denver Nuggets</a></h2> <ul> <li><a href="https://stats.denverpost.com/basketball/nba/scores"><span class="dfm-title">NBA Scoreboard</span></a></li> <li><a href="https://stats.denverpost.com/basketball/nba/standings"><span class="dfm-title">NBA Standings</span></a></li> <li><a href="https://stats.denverpost.com/basketball/nba/teamschedule/404065"><span class="dfm-title">Schedule</span></a></li> <li><a href="https://stats.denverpost.com/basketball/nba/teamstatistics/404065"><span class="dfm-title">Denver Nuggets stats</span></a></li> <li><a href="http://www.denverpost.com/tag/nuggets-mailbag/"><span class="dfm-title">Nuggets Mailbag</span></a></li> <li><a href="http://www.denverpost.com/nuggets-mailbag-form/"><span class="dfm-title">Ask mailbag questions</span></a></li> </ul> </aside>\n');
            }
            if (args.domesticViolence){
                grafsClean.splice(placeWidget, 0, '<aside class="related right"> <h2 class="widget-title">Sexual assault, domestic violence resources</h2> <strong>Denver Sexual Assault Hotline</strong>: <a href="https://thebluebench.org/">thebluebench.org</a>. Call the hotline at 303-322-7273 for free, 24-hour help. <strong>National Domestic Violence Hotline</strong>: <a href="https://www.thehotline.org/">thehotline.org</a>. Call the hotline at 1-800-799-7233 for free, 24-hour help. <strong>Violence Free Colorado</strong>: <a href="https://www.violencefreecolorado.org/find-help/programs-by-county/">Use this map to locate resources by county in Colorado</a>. The website also has resources <a href="https://www.violencefreecolorado.org/find-help/how-to-help-someone-you-know/">like a guide to helping someone</a> you know who is being abused. <strong>SafeHouse Denver</strong>: <a href="https://safehouse-denver.org/">safe-house-denver.org</a>. Reach local professionals by calling the 24-hour crisis and information line at 303-318-9989. <strong>Moving to End Sexual Assault (MESA)</strong>: <a href="https://www.mhpcolorado.org/about/services/specialty-moving-to-end-sexual-assault/" target="_blank" rel="noopener">movingtoendsexualassault.org</a>. Call the 24-hour hotline at 303-443-7300. </aside>\n');
            }
            if (args.alzheimer){
                grafsClean.splice(placeWidget, 0, '<aside class="related right"> <h2 class="widget-title">What is Alzheimer’s disease?</h2> <em>Alzheimer’s disease is a brain disorder that affects a person’s memory and thinking skills. Symptoms can include, loss of memory and difficulty with skills, such as keeping up with bills and driving. During the later stages of the disease, a person can experience delusions and paranoia.</em> <strong>Alzheimer’s Association Colorado</strong>: <a href="https://www.alz.org/co">alz.org/co</a>. Call the helpline at 800-272-3900 for free, 24-hour help. <strong>Alzheimer’s Foundation of America</strong>: <a href="https://alzfdn.org/">alzfdn.org</a>. Call the helpline at 866-232-8484 for free, 24-hour help. </aside>\n');
            }
            if (args.suicideResources){
                grafsClean.splice(placeWidget, 0, '<aside class="related right"> <h2 class="widget-title">Suicide prevention resources</h2> [cq  <span class="dfm_cq_comment" style="color: red"> <span class="dfm_cq_comment" style="color: red"> <span class="dfm_cq_comment" style="color: red"> comment="RUN THIS AS A TEXT BOX IN PRINT"</span></span></span>]<ul><li><strong>Colorado Crisis Line</strong>: 1-844-493-8255, <a  href="http://coloradocrisisservices.org">coloradocrisisservices.org</a>. Chat online or text TALK to 38255.</li><li><strong>Mental Health First Aid</strong>: <a href="http://mhfaco.org">mhfaco.org</a>. Get trained to recognize the signs and how to respond.</li><li><strong>American Foundation for Suicide Prevention</strong>: <a href="http://afsp.org">afsp.org</a>. Join one of their upcoming walks for awareness in Colorado.</li><li><strong>Crisis Text Line</strong>: <a href="http://www.crisistextline.org">crisistextline.org</a>. Text 741741 from anywhere in the nation to reach a counselor.</li><li><strong>Second Wind Fund</strong>: <a href="http://thesecondwindfund.org">thesecondwindfund.org</a>. Links students to mental health professionals and pays for up to 12 counseling sessions.</li></ul></aside>');
            }
            if (args.avalancheDanger){
                grafsClean.splice(grafsClean.length, 0, '<hr />\n' +
                    '\n' +
                    '<h3>Avalanche danger scale</h3>\n' +
                    '<em>A live look at Colorado\'s avalanche danger scale, provided by the Colorado Avalanche Information Center:</em>\n' +
                    '\n' +
                    '[dfm_iframe src="http://avalanche.state.co.us/caic/fx_map.php" width="495px" height="565px" advanced_fields="true" allowfullscreen="yes" scrolling="no" /]\n' +
                    '\n' +
                    '<img src="http://avalanche.state.co.us/caic/images/map-danger-scale.png" />\n' +
                    '\n' +
                    '<hr />');
            }
            document.getElementById('content').value = grafsClean.join('\n\n');
            return suggestedTags;
        }

        function insertCX() {
            var bookmarkletSource = document.createElement('script');
            bookmarkletSource.setAttribute('src', 'https://extras.denverpost.com/app/bookmarklet/js/cx-src.js?v='+vSec());
            document.body.appendChild(bookmarkletSource);
        }

        function insertClosures() {
            var bookmarkletSource = document.createElement('script');
            bookmarkletSource.setAttribute('src', 'https://extras.denverpost.com/app/bookmarklet/js/weather-closures.js?v='+vSec());
            document.body.appendChild(bookmarkletSource);
        }

        var APsuccessText = '<div class="ap-success"><h3>I can do that!</h3><p>Here\'s a production tip while you wait:</p><p style="font-size:120%;color:firebrick;font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;">' + getDPOtip() + '</p></div>';
        var sectionSelect = 'fm-mason_post_settings-0-schema-0-primary_section-0';
        var tagSelect = 'fm-mason_post_settings-0-schema-0-primary_tag-0';
        var appleNewsSections = {
            'broncos': 'apple-news-section-a39ee59b-d872-39ad-a323-b46261ea34ad',
            'colorado-news':'apple-news-section-f7f303a0-da3b-3a93-8c2c-93be489a30a6',
            'sports':'apple-news-section-3f7e6dbd-9845-39a3-ab67-14118fbd4a0e',
            'politics': 'apple-news-section-befc81a6-ec36-3426-9992-0ce17c5782f4',
            'business':'apple-news-section-9c5c2844-09ca-3e86-8315-87224d14c790',
            'entertainment':'apple-news-section-e401a8c2-26e7-3871-8ede-782e7e582af4',
            'lifestyle':'apple-news-section-c81ed803-584d-3a4a-b125-09beb6cf0f8b',
            'cannabist':'apple-news-section-aa2f2d08-860e-32b4-a1d3-765ea19a85d7',
            'opinion':'apple-news-section-4c9d0650-2499-3637-b87f-f9355a2a3471',
        };
        var options = autoProducerOptions;
        var validOptions = [];
        var autoProducerAllTags = [];
        for (var i=0;i<document.getElementById(tagSelect).length;i++) {
            if (document.getElementById(tagSelect).options[i].text.length >= 3) {
                autoProducerAllTags.push(document.getElementById(tagSelect).options[i].text);
            }
        }

        function resetOptionSet(newSet) {
            eraseCookie('auto-producer-options');
            createCookie('auto-producer-options',newSet,5000);
            return newSet;
        }

        var keySetup = false;
        function modifyDialog(menu_id) {
            //new top menu selector
            jQuery('.categoryMenu').click(function() {
               var menuSelected = jQuery(this).attr('id');
                newOptionSelect = resetOptionSet(menuSelected);
                buildHTML(newOptionSelect);
            });

            //story selector
            jQuery('.storyBox').click(function(){
                var storyID = jQuery(this).data('storyid');
                storySelection = storyID;
                jQuery('.storyBox').css({'background':'#eaf4ff','border':'none','font-weight':'normal'});
                jQuery(this).css({'background':'white','font-weight':'bold'});
                var toolTipInsert = jQuery('#'+storyID+' > a').data('tooltip');
                jQuery('.tipGraf').html(toolTipInsert);
            });
            //add on selector
            jQuery('.addInsert').click(function(){
                var addID = jQuery(this).attr('id');
                //only allow ap or wapo author option
                if (addID == "APauthorSelect") {
                    jQuery( ".addOnNote" ).remove();
                    jQuery( ".ui-dialog-buttonpane" ).prepend('<div class="addOnNote" style="float: left;margin-top: 15px;margin-left: 15px;color: red;">*Author will not update until post is saved.</div>');
                    console.log("remove wapo author because ap author selected");
                    jQuery("#WaPoauthorSelect").removeClass("addInsertSelected");
                    delete additionalAddOns["WaPoauthorSelect"];
                    console.log(additionalAddOns);
                }
                //only allow ap or wapo author option
                if (addID == "WaPoauthorSelect") {
                    jQuery( ".addOnNote" ).remove();
                    jQuery( ".ui-dialog-buttonpane" ).prepend('<div class="addOnNote" style="float: left;margin-top: 15px;margin-left: 15px;color: red;">*Author will not update until post is saved.</div>');
                    console.log("remove wapo author because ap author selected");
                    jQuery("#APauthorSelect").removeClass("addInsertSelected");
                    delete additionalAddOns["APauthorSelect"];
                    console.log(additionalAddOns);
                }
                if (addID == "crimeMapSelect") {
                    jQuery("#homicideSelect").removeClass("addInsertSelected");
                    delete additionalAddOns["homicideSelect"];
                    console.log(additionalAddOns);
                }
                //only allow ap or wapo author option
                if (addID == "homicideSelect") {
                    jQuery("#crimeMapSelect").removeClass("addInsertSelected");
                    delete additionalAddOns["homicideSelect"];
                    console.log(additionalAddOns);
                }





                //check if add on is in array already and remove it if it is otherwise add it
                if (additionalAddOns.hasOwnProperty(addID)) {
                    console.log("I'm ALREADY THERE...remove please");
                    jQuery( ".addOnNote" ).remove();
                    jQuery(this).toggleClass("addInsertSelected");
                    delete additionalAddOns[addID];
                    console.log(additionalAddOns);
                    //need to remove from array
                } else {
                    jQuery(this).toggleClass("addInsertSelected");
                    additionalAddOns[addID] = true;
                    console.log("add this extra thing " + addID);
                    console.log(additionalAddOns);

                }

            });
            //add embeds
            jQuery('.embedOptions').click(function(){
                var myClick = jQuery(this);
                var addID = jQuery(this).attr('id');
                var dupcheck;

                function removeAddOn(myClick) {
                    console.log("I'm ALREADY THERE...remove please");
                    jQuery( ".addOnNote" ).remove();
                    jQuery(myClick).toggleClass("addInsertSelected");
                    delete additionalAddOns[addID];
                    console.log(additionalAddOns);
                }

                //check if add on is in array already and remove it if it is otherwise add it
                if (additionalAddOns.hasOwnProperty(addID)) {
                    console.log("it's a dup!");
                    dupcheck = 1;
                    removeAddOn(myClick);
                } else {
                    jQuery(this).toggleClass("addInsertSelected");
                    additionalAddOns[addID] = true;
                    console.log("add this extra thing " + addID);
                    console.log(additionalAddOns);
                }
                if (dupcheck !== 1) {
                    if (addID == "relatedSelect") {
                        //chris

                        function askRelatedQuestions(){
                            loop:
                                while(true) {
                                    relatedText = prompt('What do you want the link to say?\n\n', '');
                                    if (relatedText !== '' && relatedText !== null) {
                                        break loop;
                                    } else {
                                        relatedText;
                                        if (relatedText !== '' && relatedText !== null) {
                                            break loop;
                                        }
                                    }
                                }
                            loop2:
                                while(true) {
                            relatedURL = prompt('What is the URL (include HTTP)?\n\n', '');
                            if (relatedURL !== '' && relatedURL !== null) {
                                //do nothing because the variables are ready
                                        break loop2;
                            }else{
                                        relatedURL;
                                        if (relatedURL !== '' && relatedURL !== null) {
                                            //do nothing because the variables are ready
                                            break loop2;
                            }
                        }
                        }

                        }
                        askRelatedQuestions();
                    }
                }
            });

            //addCorrection
            jQuery('#addCorrection').click(function(){
                insertCX();
            });

            //old select drop down code
            jQuery('#ap-option-set-select').on('change', function() {
                newOptionSelect = resetOptionSet(menu_id);
                buildHTML(newOptionSelect);
            });
            if (keySetup == false) {
                jQuery('#auto-producer').keydown(function (event) {
                    if (event.keyCode == 13) {
                        jQuery("#btnOne").trigger("click");
                        return false;
                    }
                });
                keySetup = true;
            }

            jQuery('.tooltip-link').on('mouseenter',function(){
                var tipText = jQuery(this).data("tooltip");
                jQuery('.tipGraf').html(tipText).css('display','block');
            }).on('mouseleave',function(){
                jQuery('.tipGraf').html('').css('display','none');            
            });
          //  jQuery("#APoptionSelect").get(0).focus();

            jQuery(".embeds, .sportEmbeds, .sidebars").css('display','none');
            //listen for embeds vs insert clicks
            /*
            jQuery( ".inserts" ).on( "click", function() {
                jQuery(".inserts").addClass("whichInsert");
                if ($(".addInsert").is(":visible") == true) {
                    //do nothing
                    console.log("you can see my inserts");
                }else{
                    jQuery(".embeds").removeClass("whichInsert");
                    jQuery('.addInsert').toggle();
                    jQuery('.addEmbeds').toggle();
        }
            });
            jQuery(".embeds").on("click",function() {
                jQuery(".embeds").addClass("whichInsert");
                if ($(".addEmbeds").is(":visible") == true) {
                    //do nothing
                }else{
                    jQuery(".inserts").removeClass("whichInsert");
                    jQuery('.addEmbeds').toggle();
                    jQuery('.addInsert').toggle();
                }
            });
            */
            jQuery(".embedTab").on("click",function() {
                jQuery(".embedTab").removeClass("whichInsert");
                jQuery(this).addClass("whichInsert");
                let which = jQuery(this).data('which');
                jQuery(".embedOptions").hide();
                jQuery("."+which).show();
            });
        }



        function APdialogText(options,optionSet){
            //menu select
            var menuNews = (optionSet == 'news') ? 'menuOn' : '';
            var menuSports = (optionSet == 'sports') ? 'menuOn' : '';
            var menuPolitics = (optionSet == 'politics') ? 'menuOn' : '';
            var menuBusiness = (optionSet == 'business') ? 'menuOn' : '';
            var menuEntertainment = (optionSet == 'entertainment') ? 'menuOn' : '';
            var menuOpinion = (optionSet == 'opinion') ? 'menuOn' : '';

            //category menu
            var output = '<div class="grid-x">';
            output += '<div id="news" class="cell auto categoryMenu ap-options '+menuNews+'">News</div>' +
                '<div id="sports" class="cell auto categoryMenu ap-options '+menuSports+'">Sports</div>' +
                '<div id="politics" class="cell auto categoryMenu ap-options '+menuPolitics+'">Politics</div>' +
                '<div id="business" class="cell auto categoryMenu ap-options '+menuBusiness+'">Business</div>' +
                '<div id="entertainment" class="cell auto categoryMenu ap-options '+menuEntertainment+'">Entertainment</div>' +
                '<div id="opinion" class="cell auto categoryMenu ap-options '+menuOpinion+'">Opinion</div>';
            output += '</div>'; //end grid-x

            output += '<div class="storyWrapper">';
            var displayOptions = [];
            validOptions.splice(0,validOptions.length);
            for(var object in options){
                if (options.hasOwnProperty(object) && (options[object]['option-set'] == optionSet || typeof options[object]['option-set'] == 'undefined')) {
                    displayOptions.push(object);
                    validOptions.push(object);
                }
            }
            var optsLength = Object.keys(displayOptions).length;
            var oneThird = Math.ceil(optsLength * 0.35);
            var twoThird = Math.ceil(optsLength * 0.68);
            //var newsSelected = (optionSet == 'news') ? ' selected="selected"' : ''; //old selected options
            //var sportsSelected = (optionSet == 'sports') ? ' selected="selected"' : ''; //old selected options
            var i = 0;
            for(var object in options){
                //if (i == 0){output += '<div class="grid-x">';}
                if (i % 4 == 0) {
                    output += '<div class="grid-x">';
                }
                if (options[object]['option-set'] == optionSet || typeof options[object]['option-set'] == 'undefined') {
                    //var relStar = (options[object].related) ? ' <span class="red-star">*</span>' : ' ';
                    var tooltipString = (options[object].related) ? '<p class=apDetail>Related bar included</p>' : '';
                    tooltipString += '<p>Sets <strong>Primary Section</strong> to: <br/><span class=apDetail>' + options[object]['help-primary-section'] + '</span></p>';
                    tooltipString += '<p>Selects these <strong>Trust Categories</strong>:<br/><span class=apDetail>' + options[object]['help-trust'] + '</span></p>';
                    tooltipString += '<p>Sets <strong>Primary Tag</strong> to:<br/><span class=apDetail>' + options[object]['help-primary-tag'] + '</span></p>';
                    tooltipString += '<p>Selects these <strong>Sections</strong>:<br/><span class=apDetail>' + options[object]['help-sections'] + '</span></p>';
                    tooltipString += '<p>Adds these <strong>Tags</strong>:<br/><span class=apDetail>' + options[object]['add-tags'].join(', ') + '</span></p>';
                    tooltipString += '<p>Adds <strong>Apple News</strong> sections:<br/><span class=apDetail>' + options[object]['apple-news'] + '</span></p>';
                    tooltipString += '<p>Notify:<br/><span class=apDetail>' + options[object]['notifications'] + '</span></p>';
                    tooltipString += '<p>Adds these <strong>Features</strong>:<br/><span class=apDetail>' + options[object].features.join(', ') + '</span></p>';
                    if (options.hasOwnProperty(object)) {
                        //relStar //adds a star or not to the element, not sure if i need or want this still
                        output += '<div class="cell small-3 storyBox" id="'+object.trim()+'" data-storyID="'+object.trim()+'" >' + options[object].title + ' <a class="tooltip-link" data-tooltip="' + HTMLescape(tooltipString) + '" href="#" tabindex="0"></a></div>';
                    }

                   /* if (i == oneThird || i == twoThird) {
                        output += '</ul></div><div class="one-quarter"><ul>';
                    }*/
                    i++;
                }
                if (i % 4 == 0) {
                    output += '</div> <!-- /grid-x close -->';
                }
            }
            output += '</div>';
            output += '</div>'; //.storyWrapper end
            output += '<div class="grid-x">';
            output += '<div class="cell small-3 autoDetailsWrapper">';
            //removed because new menu system is being used
            //output += '<p>Option set:<br />'
            //output += '<select id="ap-option-set-select" name="ap-option-set-select" tabindex="1">';
            //output += '<option value="news"' + newsSelected + '>News</option>';
            //output += '<option value="sports"' + sportsSelected + '>Sports</option>';
            //output += '</select>';
            //output += '</p>';
            output += '<p class="boxTitle">Auto Details</p>';
            output += '<div class="tipGraf">';
            output += '<b>Primary Section</b> to:<br/><br/>\n' +
                '<b>Primary Tag</b> to:<br/><br/>\n' +
                'Selects these <b>Sections</b>:<br/><br/>\n' +
                'Adds these <b>Tags</b>:<br/><br/>\n' +
                'Adds <b>Apple News</b> sections:<br/><br/>\n' +
                'Notify:<br/><br/>\n' +
                'Adds these <b>Features:</b><br/><br/></div>';
            output += '</div>';
           // output += '<div class="cell small-6" style="display:none;">';
           // output += '<p><strong>Enter selection:</strong></p><p><input type="text" id="APoptionSelect" tabindex="1"></p>';
           // output += '</div>';
            output += '<div class="cell small-7 addInsertWrapper">';
            output += '<div class="boxTitle grid-x"><div class="cell auto embedTab" data-which="inserts">Additional Inserts</div><div class="cell auto embedTab" data-which="embeds">Data Embeds</div><div class="cell auto embedTab" data-which="sportEmbeds">Sport Embeds</div><div class="cell auto embedTab" data-which="sidebars" style="font-size:12px;">Story Sidebars/Embeds</div></div>';
            //story sidebars
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions sidebars " id="domesticViolence" data-addinserts="30">Domestic Violence</div>';
            output += '<div class="cell auto embedOptions sidebars " id="alzheimer" data-addinserts="31">Alzheimer</div>';
            output += '<div class="cell auto embedOptions sidebars " id="suicideResources" data-addinserts="32">Suicide Resources</div>';
            output += '<div class="cell auto embedOptions sidebars " id="avalancheDanger" data-addinserts="32">Avalanche Danger Scale</div>';
            output += '</div>'; //grid-x

            //SPORTS EMBEDS
            /* NONE OF THESE WORK
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesScoreboard" data-addinserts="20">Rockies Scoreboard</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="nlwestStandings" data-addinserts="21">NL West Standings</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesSchedule" data-addinserts="22">Rockies Schedule next5/last10</div>';
            output += '</div>'; //grid-x
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesLeaders" data-addinserts="23">Rockies Team Leader</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesOffense" data-addinserts="24">Rockies Offence</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesDefense" data-addinserts="25">Rockies Pitching/Defense</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="mlbHomeRunLeaders" data-addinserts="26">MLB Home run leaders</div>';
            output += '</div>'; //grid-x
            */
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="rockiesGeneral" data-addinserts="19">Rockies General</div>';
            output += '<div class="cell auto embedOptions sportEmbeds rockies" id="nlwestStandings" data-addinserts="21">NL West Standings</div>';
            output += '<div class="cell auto embedOptions sportEmbeds broncos" id="broncosGeneral" data-addinserts="27">Broncos General</div>';
            output += '<div class="cell auto embedOptions sportEmbeds avalanche" id="avalancheGeneral" data-addinserts="128">Avalanche General</div>';
            output += '<div class="cell auto embedOptions sportEmbeds nuggets" id="nuggestGeneral" data-addinserts="29">Nuggets General</div>';
            output += '</div>'; //grid-x

            //KEVIN EMBEDS
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions embeds" id="officerShootingSelect" data-addinserts="15">Officer-involved shootings map</div>';
            output += '<div class="cell auto embedOptions embeds" id="realEstateSelect" data-addinserts="15">Real Estate developments</div>';
            output += '<div class="cell auto embedOptions embeds" id="oilGasSelect" data-addinserts="16">Oil and gas permit map</div>';
            output += '<div class="cell auto embedOptions embeds" id="wildfireSelect" data-addinserts="17">Wildfire map</div>';
            output += '<div class="cell auto embedOptions embeds" id="homicideSelect" data-addinserts="18">Homicide report</div>';
            output += '</div>'; //grid-x

            //GENERAL EMBEDS
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions inserts" id="relatedSelect" data-addinserts="2">Insert Related</div>';
            output += '<div class="cell auto embedOptions inserts" id="fullBleedSelect" data-addinserts="14">Full Bleed </div>';
            output += '<div class="cell auto embedOptions inserts" id="newsletterSelect" data-addinserts="5">Newsletter widget</div>';
            output += '<div class="cell auto embedOptions inserts" id="closureSelect" data-addinserts="11">School Closures</div>';
            output += '</div>'; //grid-x
            output += '<div class="grid-x">';
            //remove later
            // output += '<div class="cell auto embedOptions inserts" id="supportSelect" data-addinserts="3">Support Message</div>';
            output += '<div class="cell auto embedOptions inserts" id="ethicsSelect" data-addinserts="3">Ethics Box</div>';
            output += '<div class="cell auto embedOptions inserts" id="appPromo" data-addinserts="6">App Promo Widget</div>';
            output += '<div class="cell auto embedOptions inserts" id="hateSelect" data-addinserts="8">Documenting Hate</div>';
            output += '<div class="cell auto embedOptions inserts" id="APauthorSelect" data-addinserts="12">Author -> AP</div>';
            output += '</div>'; //grid-x
            output += '<div class="grid-x">';
            output += '<div class="cell auto embedOptions inserts" id="promoSelect" data-addinserts="4">Insert Promos</div>';
            output += '<div class="cell auto embedOptions inserts" id="youtubeSelect" data-addinserts="7">YouTube video</div>';
            output += '<div class="cell auto embedOptions inserts" id="crimeMapSelect" data-addinserts="10">Crime Map widget</div>';
            output += '<div class="cell auto embedOptions inserts" id="WaPoauthorSelect" data-addinserts="13">Author -> WaPo</div>';
            output += '</div>'; //grid-x
            output += '<div class="grid-x" style="margin-top:10px;">';
            output += '<div class="cell small-3 embedOptions inserts" id="addCorrection">Add Correction</div>';
            output += '</div>'; //grid-x
            output += '</div>'; //cell small-7
            output += '<div class="clear"></div>';
            output += '</div>'; //grid-x from line 1078
            /*
            //removed for now. To confusing.
            output += '<p class="red-small">Items with a star insert Related by Primary Tag automatically.<br />Related items will only be inserted on articles with 6 or more paragraphs.</p>';
            output += '<p class="blue-small">AP will override WaPo if both are checked; you WILL NOT see the new author until you save.</p>';
            output += '<p class="mag-small">Overrides the Crime Map if both are checked.</p>';
            output += '<div class="ap-help"><a href="https://extras.denverpost.com/app/bookmarklet/ap-help.html" target="_blank">AUTO🤖PRODUCER™ Help</a></div></div>';
            */
            return output;
        }

        function processAPform() {
            console.log("PROCESSING THIS");
            console.log(storySelection);
            if (storySelection == 0) {
                //alert("You didn't select anything ¯\\_(ツ)_/¯");
            }
            if (typeof processing == 'undefined') {
                processing = true;
                var args = additionalAddOns;
                if (typeof selectFunction == 'undefined') {
                    // var selectFunction = (jQuery('#APoptionSelect').val() == '') ? '0' : jQuery('#APoptionSelect').val(); //old select story
                    var selectFunction = (storySelection == '') ? '0' : storySelection;
                }
                console.log("inside process function");

                /*
                // old check box system these are now saved in an onclick function up higher once each button is selected
                args['selectRelated'] = jQuery('#relatedSelect').prop('checked');
                args['APauthorSelect'] = jQuery('#APauthorSelect').prop('checked');
                args['WaPoauthorSelect'] = jQuery('#WaPoauthorSelect').prop('checked');
                args['promoSelect'] = jQuery('#promoSelect').prop('checked') ? true : false;
                args['supportSelect'] = jQuery('#supportSelect').prop('checked') ? true : false;
                args['youtubeSelect'] = jQuery('#youtubeSelect').prop('checked') ? true : false;
                args['appPromo'] = jQuery('#appPromo').prop('checked') ? true : false;
                args['newsletterSelect'] = jQuery('#newsletterSelect').prop('checked') ? true : false;
                args['hateSelect'] = jQuery('#hateSelect').prop('checked') ? true : false;
                args['homicideSelect'] = jQuery('#homicideSelect').prop('checked') ? true : false;
                args['closureSelect'] = jQuery('#closureSelect').prop('checked') ? true : false;
                args['crimeMapSelect'] = jQuery('#crimeMapSelect').prop('checked') ? true : false;
                */
                if (validOptions.indexOf(String(selectFunction)) !== -1) {
                    jQuery('#auto-producer').html(APsuccessText);
                    trumpThatBitch(options[selectFunction],args);
                    setTimeout( function() { jQuery('#auto-producer').dialog('close'); },2200);
                } else {
                    var again = confirm('That\'s not a valid option. Try again, or Cancel to quit.');
                    if (again === false) {
                        jQuery('#auto-producer').dialog('close');
                    } else {
                        return false;
                    }
                }
            }
        }

        function buildHTML(optionSelected) {
            jQuery('#auto-producer').html(APdialogText(options,optionSelected));
            modifyDialog();
        }

        //make the JQUERY dialog box response and a couple other cool features
        //https://github.com/jasonday/jQuery-UI-Dialog-extended
        // add new options with default values
        jQuery.ui.dialog.prototype.options.clickOut = true;
        jQuery.ui.dialog.prototype.options.responsive = true;
        jQuery.ui.dialog.prototype.options.scaleH = 0.8;
        jQuery.ui.dialog.prototype.options.scaleW = 0.8;
        jQuery.ui.dialog.prototype.options.showTitleBar = false;
        jQuery.ui.dialog.prototype.options.showCloseButton = true;





// extend open function
        var _open = $.ui.dialog.prototype.open;
        jQuery.ui.dialog.prototype.open = function () {
            var self = this;

            // apply original arguments
            _open.apply(this, arguments);

            // get dialog original size on open
            var oHeight = self.element.parent().outerHeight(),
                oWidth = self.element.parent().outerWidth(),
                isTouch = $("html").hasClass("touch");

            // responsive width & height
            var resize = function () {

                //check if responsive
                // dependent on modernizr for device detection / html.touch
                if (self.options.responsive === true || (self.options.responsive === "touch" && isTouch)) {
                    var elem = self.element,
                        wHeight = $(window).height(),
                        wWidth = $(window).width(),
                        dHeight = elem.parent().outerHeight(),
                        dWidth = elem.parent().outerWidth(),
                        setHeight = Math.min(wHeight * self.options.scaleH, oHeight),
                        setWidth = Math.min(wWidth * self.options.scaleW, oWidth);

                    if ((oHeight + 100) > wHeight || elem.hasClass("resizedH")) {
                        elem.dialog("option", "height", setHeight).parent().css("max-height", setHeight);
                        elem.addClass("resizedH");
                    }
                    if ((oWidth + 100) > wWidth || elem.hasClass("resizedW")) {
                        elem.dialog("option", "width", setWidth).parent().css("max-width", setWidth);
                        elem.addClass("resizedW");
                    }

                    // only recenter & add overflow if dialog has been resized
                    if (elem.hasClass("resizedH") || elem.hasClass("resizedW")) {
                        elem.dialog("option", "position", "center");
                        elem.css("overflow", "auto");
                    }
                }

                // add webkit scrolling to all dialogs for touch devices
                if (isTouch) {
                    elem.css("-webkit-overflow-scrolling", "touch");
                }
            };

            // call resize()
            resize();

            // resize on window resize
            jQuery(window).on("resize", function () {
                resize();
            });

            // resize on orientation change
            window.addEventListener("orientationchange", function () {
                resize();
            });

            // hide titlebar
            if (!self.options.showTitleBar) {
                self.uiDialogTitlebar.css({
                    "height": 0,
                    "padding": 0,
                    "background": "none",
                    "border": 0
                });
                self.uiDialogTitlebar.find(".ui-dialog-title").css("display", "none");
            }

            //hide close button
            if (!self.options.showCloseButton) {
                self.uiDialogTitlebar.find(".ui-dialog-titlebar-close").css("display", "none");
            }

            // close on clickOut
            if (self.options.clickOut && !self.options.modal) {
                // use transparent div - simplest approach (rework)
                jQuery('<div id="dialog-overlay"></div>').insertBefore(self.element.parent());
                jQuery('#dialog-overlay').css({
                    "position": "fixed",
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0,
                    "background-color": "transparent"
                });
                jQuery('#dialog-overlay').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.close();
                });
                // else close on modal click
            } else if (self.options.clickOut && self.options.modal) {
                jQuery('.ui-widget-overlay').click(function (e) {
                    self.close();
                });
            }

            // add dialogClass to overlay
            if (self.options.dialogClass) {
                jQuery('.ui-widget-overlay').addClass(self.options.dialogClass);
            }
        };
//end open


// extend close function

        var _close = $.ui.dialog.prototype.close;
        jQuery.ui.dialog.prototype.close = function () {
            var self = this;
            // apply original arguments
            _close.apply(this, arguments);

            // remove dialogClass to overlay
            if (self.options.dialogClass) {
                jQuery('.ui-widget-overlay').removeClass(self.options.dialogClass);
            }
            //remove clickOut overlay
            if (jQuery("#dialog-overlay").length) {
                jQuery("#dialog-overlay").remove();
            }

        };

//end close
        //end JQUERY dialog extends

        jQuery('#auto-producer').dialog({
            autoOpen: false,
            buttons: [
                {
                //not being used right now.
                    id: "btnCapture",
                    text: "CAPTURE",
                    click: function () {
                        captureNew();
                    },
                    tabindex: 17
                },
                /*
                //school closures is a dup.
                {
                    id: "btnClosures",
                    text: "Add School Closures",
                    click: function () {
                        insertClosures();
                    },
                    tabindex: 16
                },
                //moved this button up to be with additional addons 
                {
                    id: "btnCX",
                    text: "Add Correction",
                    click: function () {
                        insertCX();
                    },
                    tabindex: 14
                },
                */
                {
                    id: "btnCancel",
                    text: "CANCEL",
                    click: function(){
                        jQuery(this).dialog('close');
                    },
                    tabindex: 11
                },
                {
                    id: "btnOne",
                    text: "AUTO🤖PRODUCE™!",
                    click: function () {
                        processAPform();
                    },
                    tabindex: 10
                }
            ],
           // title: 'Denver Post AUTO🤖PRODUCER™' + APversion, //removed in variable above and commented out here
            resize: 'auto',
            modal: true,
            minWidth: 940,
            responsive: true,
            position: { my: 'top', at: 'top+30', of: window, collision: "fit", within: window },
            create: function (event, ui) {
                jQuery(event.target).parent().css('position', 'fixed');
            },
            open: function(event, ui) { buildHTML(optionSelect); }
        });
        jQuery('#auto-producer').dialog('open');
    }
//end of autoProducerPost

    function autoProducerContentHub() {
        var options = {
            '1': {
                'title': 'Akron News-Reporter',
                'search-term': '34329',
                'default': false,
            },
            '2': {
                'title': 'Boulder Daily Camera',
                'search-term': '15221',
                'default': false,
            },
            '3': {
                'title': 'Broomfield Enterprise',
                'search-term': '15186',
                'default': false,
            },
            '4': {
                'title': 'Brush News-Tribune',
                'search-term': '36411',
                'default': false,
            },
            '5': {
                'title': 'Burlington Record',
                'search-term': '35036',
                'default': false,
            },
            '6': {
                'title': 'Canon City Daily Record',
                'search-term': '34355',
                'default': false,
            },
            '7': {
                'title': 'Colorado Daily',
                'search-term': '15198',
                'default': false,
            },
            '8': {
                'title': 'Colorado Hometown Weekly',
                'search-term': '15196',
                'default': false,
            },
            '9': {
                'title': 'Daily News',
                'search-term': '15200',
                'default': false,
            },
            '10': {
                'title': 'East Bay Times',
                'search-term': '1622',
                'default': false,
            },
            '11': {
                'title': 'Estes Park Trail-Gazette',
                'search-term': '15188',
                'default': false,
            },
            '12': {
                'title': 'Fort Morgan Times',
                'search-term': '34573',
                'default': false,
            },
            '13': {
                'title': 'Inland Valley Daily Bulletin',
                'search-term': '34963',
                'default': false,
            },
            '14': {
                'title': 'Journal Advocate',
                'search-term': '34309',
                'default': false,
            },
            '15': {
                'title': 'Julesburg Advocate',
                'search-term': '15190',
                'default': false,
            },
            '16': {
                'title': 'Lamar Ledger',
                'search-term': '15191',
                'default': false,
            },
            '17': {
                'title': 'Long Beach Press Telegram',
                'search-term': '35863',
                'default': false,
            },
            '18': {
                'title': 'Longmont Times-Call',
                'search-term': '34489',
                'default': false,
            },
            '19': {
                'title': 'Loveland Reporter-Herald',
                'search-term': '34496',
                'default': false,
            },
            '20': {
                'title': 'Marin Independent Journal',
                'search-term': '36400',
                'default': false,
            },
            '21': {
                'title': 'Orange County Register',
                'search-term': '61573',
                'default': false,
            },
            '22': {
                'title': 'Press Enterprise',
                'search-term': '60636',
                'default': false,
            },
            '23': {
                'title': 'Redlands Daily Facts',
                'search-term': '36382',
                'default': false,
            },
            '24': {
                'title': 'Reverb',
                'search-term': '2049',
                'default': false,
            },
            '25': {
                'title': 'San Bernardino County Sun',
                'search-term': '36170',
                'default': false,
            },
            '26': {
                'title': 'Santa Cruz Sentinel',
                'search-term': '36379',
                'default': false,
            },
            '27': {
                'title': 'SCNG',
                'search-term': '62230',
                'default': false,
            },
            '28': {
                'title': 'Silicon Valley',
                'search-term': '1954',
                'default': false,
            },
            '29': {
                'title': 'The Associated Press',
                'search-term': '2790',
                'default': false,
            },
            '30': {
                'title': 'The Cannabist',
                'search-term': '2055',
                'default': false,
            },
            '31': {
                'title': 'The Cannifornian',
                'search-term': '26267',
                'default': false,
            },
            '32': {
                'title': 'The Daily Breeze',
                'search-term': '36383',
                'default': false,
            },
            '33': {
                'title': 'The Denver Post',
                'search-term': '9',
                'default': false,
            },
            '34': {
                'title': 'The Know',
                'search-term': '9749',
                'default': true,
            },
            '35': {
                'title': 'The Mercury News',
                'search-term': '1598',
                'default': false,
            },
            '36': {
                'title': 'The Pasadena Star-News',
                'search-term': '36167',
                'default': false,
            },
            '37': {
                'title': 'The San Gabriel Valley Tribune',
                'search-term': '35862',
                'default': false,
            },
            '38': {
                'title': 'The Whittier Daily News',
                'search-term': '36573',
                'default': false,
            },
            '39': {
                'search-term': '2',
                'title': 'Twin Cities',
                'default': false,
            }
        };

        var APsuccessText = '<div class="ap-success"><h3>Waiting for freakin\' Content Hub...</h3><p>Here\'s a production tip while you wait:</p><p style="font-size:120%;color:firebrick;font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;">' + getDPOtip() + '</p></div>';

        function modifyDialog() {
            jQuery('#auto-producer').keydown(function (event) {
                if (event.keyCode == 13) {
                    jQuery("#btnOne").trigger("click");
                    return false;
                }
            });
            jQuery("input[name=searchname]:checked").focus();
        }

        function APdialogText(options){
            var output = '<div class="ap-options"><p>Welcome to The Denver Post AUTO🤖SEARCHER™ for CONTENT HUB. Here\'s what I can do for you:</p>';
            output += '<div class="one-half"><p><strong>Select a news source:</strong></p>';
            output += '<select id="ap-ch-search-select" name="ap-ch-search-select" tabindex="1">';
            for(var object in options){
                if (options.hasOwnProperty(object)) {
                    var selected = (options[object]['default'] == true) ? ' selected="selected"' : '';
                    output += '<option value="' + options[object]['search-term'] + '"' + selected + '>' + options[object]['title'] + '</option>';
                }
            }
            output += '</select>';
            output += '</div>';
            output += '<div class="one-half"><p><strong>Select a date range:</strong></p>';
            output += '<input type="radio" name="searchlength" value="0" tabindex="-1" /> No date range<br />';
            output += '<input type="radio" name="searchlength" value="1" tabindex="2" checked /> 1 day<br />';
            output += '<input type="radio" name="searchlength" value="2" tabindex="-1" /> 2 days<br />';
            output += '<input type="radio" name="searchlength" value="7" tabindex="-1" /> 7 days<br />';
            output += '<input type="radio" name="searchlength" value="30" tabindex="-1" /> 30 days<br />';
            output += '</div>';
            output += '<div class="clear"></div>';
            output += '<p>Add a search term? <input type="text" id="APoptionSelect" tabindex="3"></p>';
            output += '<div class="ap-help"><a href="https://extras.denverpost.com/app/bookmarklet/ap-help.html" target="_blank">AUTO🤖PRODUCER™ Help</a></div></div>';
            return output;
        }

        function fillDates(days) {
            if (days !== 0) {
                var now = new Date();
                var backup = now - 1000 * 60 * 60 * 24 * days;
                var then = new Date(backup);
                document.getElementById('dfm_hub_start_mm').value = padNum(then.getMonth() + 1);
                document.getElementById('dfm_hub_start_dd').value = padNum(then.getDate());
                document.getElementById('dfm_hub_start_yyyy').value = then.getFullYear();
                document.getElementById('dfm_hub_end_mm').value = padNum(now.getMonth() + 1);
                document.getElementById('dfm_hub_end_dd').value = padNum(now.getDate() + 1);
                document.getElementById('dfm_hub_end_yyyy').value = now.getFullYear();
            }
        }

        function processContentHubForm() {
            var searchLength = jQuery('input[name=searchlength]:checked').val();
            var searchString = jQuery('#APoptionSelect').val();
            var selectSearch = jQuery('#ap-ch-search-select').val();
            fillDates(searchLength);
            jQuery('#hub_search-search-input').val(searchString);
            jQuery('#hub_search-search-select option[value="' + selectSearch + '"]').attr('selected','selected');
            jQuery('#auto-producer').html(APsuccessText);
            jQuery('#search-submit').trigger("click");
        }

        jQuery('#auto-producer').html(APdialogText(options));
        jQuery('#auto-producer').dialog({
            autoOpen: false,
            buttons: [
                {
                    id: "btnCancel",
                    text: "Cancel",
                    click: function(){
                        jQuery(this).dialog('close');
                    },
                    tabindex: 5
                },
                {
                    id: "btnOne",
                    text: "AUTO🤖SEARCH™!",
                    click: function () {
                        processContentHubForm();
                    },
                    tabindex: 4
                }
            ],
            title: 'Denver Post AUTO🤖SEARCHER™' + APversion,
            resize: 'auto',
            modal: true,
            minWidth: 900,
            position: { my: 'center', at: 'center', of: window, collision: "none" },
            create: function (event, ui) {
                jQuery(event.target).parent().css('position', 'fixed');
            },
            open: function(event, ui) { modifyDialog(); }
        });
        jQuery('#auto-producer').dialog('open');
    }

    function autoProducerWireHub() {
        var options = {
            '0': {
                'title': 'None',
                'search-term': '',
                'default': ' checked',
            },
            '1': {
                'title': 'Associated Press',
                'search-term': 'AP ',
                'default': false,
            },
            '2': {
                'title': 'Washington Post',
                'search-term': 'washington post ',
                'default': false,
            },
            '3': {
                'title': 'Bloomberg (experimental)',
                'search-term': 'bloomberg ',
                'default': false,
            }
        };
        var APsuccessText = '<div class="ap-success"><h3>Waiting for freakin\' Wire Hub...</h3><p>Here\'s a production tip while you wait:</p><p style="font-size:120%;color:firebrick;font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;">' + getDPOtip() + '</p></p>';

        function modifyDialog() {
            jQuery('#auto-producer').keydown(function (event) {
                if (event.keyCode == 13) {
                    jQuery("#btnOne").trigger("click");
                    return false;
                }
            });
            jQuery("input[name=searchname]:checked").focus();
        }

        function APdialogText(options){
            var output = '<div class="ap-options"><p>Welcome to The Denver Post AUTO🤖SEARCHER™ for WIRE HUB. Here\'s what I can do for you:</p>';
            output += '<div class="one-half"><p><strong>Select a news source:</strong></p>';
            for(var object in options){
                if (options.hasOwnProperty(object)) {
                    var tabind = (options[object]['default']) ? ' tabindex="1"' : ' tabindex="-1"';
                    output += '<input type="radio" name="searchname" value="' + options[object]['search-term'] + '" ' + tabind + options[object]['default'] + '> ' + options[object]['title'] + '<br />';
                }
            }
            output += '</div>';
            output += '<div class="one-half"><p><strong>Select a date range:</strong></p>';
            output += '<input type="radio" name="searchlength" value="0" tabindex="-1" /> No date range<br />';
            output += '<input type="radio" name="searchlength" value="1" tabindex="2" checked /> 1 day<br />';
            output += '<input type="radio" name="searchlength" value="2" tabindex="-1" /> 2 days<br />';
            output += '<input type="radio" name="searchlength" value="7" tabindex="-1" /> 7 days<br />';
            output += '<input type="radio" name="searchlength" value="30" tabindex="-1" /> 30 days<br />';
            output += '</div>';
            output += '<div class="clear"></div>';
            output += '<p>Add a search term? <input type="text" id="APoptionSelect" tabindex="3"></p>';
            output += '<div class="ap-help"><a href="https://extras.denverpost.com/app/bookmarklet/ap-help.html" target="_blank">AUTO🤖PRODUCER™ Help</a></div></div>';
            return output;
        }

        function fillDates(days) {
            if (days !== 0) {
                var now = new Date();
                var backup = now - 1000 * 60 * 60 * 24 * days;
                var then = new Date(backup);
                document.getElementById('dfm_hub_start_mm').value = padNum(then.getMonth() + 1);
                document.getElementById('dfm_hub_start_dd').value = padNum(then.getDate());
                document.getElementById('dfm_hub_start_yyyy').value = then.getFullYear();
                document.getElementById('dfm_hub_end_mm').value = padNum(now.getMonth() + 1);
                document.getElementById('dfm_hub_end_dd').value = padNum(now.getDate() + 1);
                document.getElementById('dfm_hub_end_yyyy').value = now.getFullYear();
            }
        }

        function processWireHubForm() {
            var searchLength = jQuery('input[name=searchlength]:checked').val();
            var selectFunction = jQuery('#APoptionSelect').val();
            var selectSearch = jQuery("input[name=searchname]:checked").val();
            var searchString = (selectFunction !== '') ? selectSearch + selectFunction : selectSearch;
            fillDates(searchLength);
            jQuery('#hub_search-search-input').val(searchString);
            jQuery('#auto-producer').html(APsuccessText);
            jQuery('#search-submit').trigger("click");
        }

        jQuery('#auto-producer').html(APdialogText(options));
        jQuery('#auto-producer').dialog({
            autoOpen: false,
            buttons: [
                {
                    id: "btnCancel",
                    text: "Cancel",
                    click: function(){
                        jQuery(this).dialog('close');
                    },
                    tabindex: 5
                },
                {
                    id: "btnOne",
                    text: "AUTO🤖SEARCH™!",
                    click: function () {
                        processWireHubForm();
                    },
                    tabindex: 4
                }
            ],
            title: 'Denver Post AUTO🤖SEARCHER™' + APversion,
            resize: 'auto',
            modal: true,
            minWidth: 900,
            position: { my: 'center', at: 'center', of: window, collision: "none" },
            create: function (event, ui) {
                jQuery(event.target).parent().css('position', 'fixed');
            },
            open: function(event, ui) { modifyDialog(); }
        });
        jQuery('#auto-producer').dialog('open');
    }

    function autoProducerSearch() {
        var options = {
            '1': {
                'title': 'Associated Press',
                'search-term': 'associated press',
                'default': ' checked',
            }
        };
        var APsuccessText = '<div class="ap-success"><h3>Waiting for the freakin\' Article Search...</h3><p>Here\'s a production tip while you wait:</p><p style="font-size:120%;color:firebrick;font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;">' + getDPOtip() + '</p></p>';

        function modifyDialog() {
            jQuery('#auto-producer').keydown(function (event) {
                if (event.keyCode == 13) {
                    jQuery("#btnOne").trigger("click");
                    return false;
                }
            });
            jQuery("input[name=searchlength]:checked").focus();
        }

        function APdialogText(options){
            var output = '<div class="ap-options"><p>Welcome to The Denver Post AUTO🤖SEARCHER™ for ARTICLES. Here\'s what I can do for you:</p>';
            /* output += '<div class="one-half"><p><strong>Select a news source:</strong></p>';
            for(var object in options){
                if (options.hasOwnProperty(object)) {
                    var tabind = (options[object]['default']) ? ' tabindex="1"' : ' tabindex="-1"';
                    output += '<input type="radio" name="searchname" value="' + options[object]['search-term'] + '" ' + tabind + options[object]['default'] + '> ' + options[object]['title'] + '<br />';
                }
            }
            output += '</div>'; */
            output += '<div class="one-half"><p><strong>Select a date range:</strong></p>';
            output += '<input type="radio" name="searchlength" value="0" tabindex="-1" /> No date range<br />';
            output += '<input type="radio" name="searchlength" value="1" tabindex="2" checked /> 1 day<br />';
            output += '<input type="radio" name="searchlength" value="2" tabindex="-1" /> 2 days<br />';
            output += '<input type="radio" name="searchlength" value="7" tabindex="-1" /> 7 days<br />';
            output += '<input type="radio" name="searchlength" value="30" tabindex="-1" /> 30 days<br />';
            output += '</div>';
            output += '<div class="clear"></div>';
            output += '<p>Add a search term? <input type="text" id="APoptionSelect" tabindex="3"></p>';
            output += '<div class="ap-help"><a href="https://extras.denverpost.com/app/bookmarklet/ap-help.html" target="_blank">AUTO🤖PRODUCER™ Help</a></div></div>';
            return output;
        }

        function fillDates(days) {
            var now = new Date();
            var backup = now - 1000 * 60 * 60 * 24 * days;
            var then = new Date(backup);
            jQuery('select[name="dfm_start_mm"]').val(padNum(then.getMonth() + 1));
            jQuery('select[name="dfm_start_dd"]').val(padNum(then.getDate()));
            jQuery('select[name="dfm_start_yyyy"]').val(then.getFullYear());
            jQuery('select[name="dfm_end_mm"]').val(padNum(now.getMonth() + 1));
            jQuery('select[name="dfm_end_dd"]').val(padNum(now.getDate()) + 1);
            jQuery('select[name="dfm_end_yyyy"]').val(now.getFullYear());
        }

        function processSearchForm() {
            var searchLength = jQuery('input[name=searchlength]:checked').val();
            var selectFunction = jQuery('#APoptionSelect').val();
            /* var selectSearch = jQuery("input[name=searchname]:checked").val(); 
            var searchString = (selectFunction != '') ? selectSearch + ' ' + selectFunction : selectSearch; */
            fillDates(searchLength);
            jQuery('#post-search-input').val(selectFunction);
            jQuery('#auto-producer').html(APsuccessText);
            jQuery('#post-query-submit').trigger("click");
        }

        jQuery('#auto-producer').html(APdialogText(options));
        jQuery('#auto-producer').dialog({
            autoOpen: false,
            buttons: [
                {
                    id: "btnCancel",
                    text: "Cancel",
                    click: function(){
                        jQuery(this).dialog('close');
                    },
                    tabindex: 5
                },
                {
                    id: "btnOne",
                    text: "AUTO🤖SEARCH™!",
                    click: function () {
                        processSearchForm();
                    },
                    tabindex: 4
                }
            ],
            title: 'Denver Post AUTO🤖SEARCHER™' + APversion,
            resize: 'auto',
            modal: true,
            minWidth: 900,
            position: { my: 'center', at: 'center', of: window, collision: "none" },
            create: function (event, ui) {
                jQuery(event.target).parent().css('position', 'fixed');
            },
            open: function(event, ui) { modifyDialog(); }
        });
        jQuery('#auto-producer').dialog('open');
    }

    function autoProducerPick() {
        if (loc.indexOf('edit.php') > -1) {
            autoProducerSearch();
        } else if (loc.indexOf('content_hub_view') > -1) {
            autoProducerContentHub();
        } else if (loc.indexOf('wire_hub_view') > -1) {
            autoProducerWireHub();
        } else if (loc.indexOf('post.php') > -1) {
            autoProducerPost();
        }
    }

    var optionSetting = readCookie('auto-producer-options');
    //var optionSelect = (optionSetting != null) ? optionSetting : 'news'; //old checking for cookie varibale
    var optionSelect = 'news'; //hardcoding starting with news
    var loc = window.location.href;
    var allTags = [];
    if (document.body.classList.contains('modal-open') || loc.indexOf('upload.php') > -1) {
        var bookmarkletSource = document.createElement('script');
        bookmarkletSource.setAttribute('src', 'https://extras.denverpost.com/app/bookmarklet/js/photo-cleanup.min.js?v='+vSec());
        document.body.appendChild(bookmarkletSource);
    } else {
        if (!document.body.contains(document.getElementById('auto-producer'))) {
            var APstyle = window.document.createElement('link');
            APstyle.setAttribute('rel','stylesheet');
            APstyle.setAttribute('href','https://extras.denverpost.com/app/bookmarklet/js/newauto/auto-producer.css?v='+vSec());
            window.document.body.appendChild(APstyle);
            var s2 = window.document.createElement('script');
            s2.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js');
            window.document.body.appendChild(s2);
            var dialogJS = window.document.createElement('script');
            dialogJS.setAttribute('src','https://extras.denverpost.com/app/bookmarklet/js/jquery.dialogOptions.js');
            window.document.body.appendChild(dialogJS);
            var tagJS = window.document.createElement('script');
            tagJS.setAttribute('src','https://extras.denverpost.com/app/bookmarklet/autoproducer/ap-tagignore.js?v='+vSec());
            window.document.body.appendChild(tagJS);
            var optionsJS = window.document.createElement('script');
            optionsJS.setAttribute('src','https://extras.denverpost.com/app/bookmarklet/js/newauto/ap-options-new-ui.min.js?v='+vSec());
            window.document.body.appendChild(optionsJS);
            var APdiv = window.document.createElement('div');
            APdiv.setAttribute('id','auto-producer');
            window.document.body.appendChild(APdiv);
            var foundation = window.document.createElement('script');
            foundation.setAttribute('src','https://cdn.jsdelivr.net/npm/foundation-sites@6.5.1/dist/js/foundation.min.js');
            foundation.setAttribute('crossorigin','anonymous');
            document.body.appendChild(foundation);
            var foundationStyle = window.document.createElement('link');
            foundationStyle.setAttribute('rel','stylesheet');
            foundationStyle.setAttribute('href','https://extras.denverpost.com/app/bookmarklet/foundation_iframe.css?v='+vSec());
            document.body.appendChild(foundationStyle);
        }

        var requirementsLoaded = setInterval(function() {
            if (typeof autoProducerTagList != 'undefined' && typeof autoProducerOptions != 'undefined' && typeof jQuery.ui.dialog != 'undefined') {
                clearInterval(requirementsLoaded);
                autoProducerPick();
            }
        }, 20);
    }
}());