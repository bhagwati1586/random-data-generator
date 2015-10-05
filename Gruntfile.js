'use strict';

module.exports = function (grunt) {
   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
	  prompt: {
		mochacli: {
		  options: {
			questions: [
			  {
				config: 'mochacli.options.records',
				type: 'input',
				message: 'How many Records You want?',
				default: 'spec',
			  },
			  {
				config: 'mochacli.options.qsize',
				type: 'input',
				message: 'What is your Query Size?',
				default: 'spec',
			  }
			]
		  }
		}
	  },
	  "file-creator": {
		  "basic": {
			  "customer_data.sql": function(fs, fd, done) {
				  
				  var schema = "CREATE DATABASE IF NOT EXISTS customer_data;"+"\n\n"+
				  
				  "USE customer_data;"+"\n\n"
				  +
				  "CREATE TABLE IF NOT EXISTS `customer_data` (`customerNumber` int(11) NOT NULL AUTO_INCREMENT,`first_name` varchar(50) NOT NULL,`last_name` varchar(50) NOT NULL,`company_name` varchar(50) NOT NULL,`address` varchar(50) NOT NULL,`city` varchar(50) NOT NULL,`country` varchar(50) NOT NULL,`postal` varchar(15) DEFAULT NULL,`phone1` varchar(15) DEFAULT NULL,`phone2` varchar(15) DEFAULT NULL,`email` varchar(50) NOT NULL,`web` varchar(50) NOT NULL,PRIMARY KEY (`customerNumber`));"+"\n\n\n"
				  +
				  "INSERT INTO `customer_data` (`customerNumber`,`first_name`,`last_name`,`company_name`,`address`,`city`,`country`,`postal`,`phone1`,`phone2`,`email`,`web`) VALUES";

				  fs.writeSync(fd, schema);

				  var valueset = "INSERT INTO `customer_data` (`customerNumber`,`first_name`,`last_name`,`company_name`,`address`,`city`,`country`,`postal`,`phone1`,`phone2`,`email`,`web`) VALUES";

				  var datab = require('./data.json');
				  var len = grunt.config('mochacli.options.records');
				  var querysize = grunt.config('mochacli.options.qsize');

				  console.log("Total Item Found : "+datab.length+"\n");
				  console.log("Total Number of Generated Records : "+datab.length+"\n");
				  
			
				  for(var i=1; i<=len; i++)
				  {
					  var t = Math.floor((Math.random() * 2000) + 1) -1;
					  var result = '('+(i)+',"'+datab[t].first_name+'","'+datab[t].last_name+'","'+datab[t].company_name+'","'+datab[t].address+'","'+datab[t].city+'","'+datab[t].county+'","'+datab[t].postal+'","'+datab[t].phone1+'","'+datab[t].phone2+'","'+datab[t].email+'","'+datab[t].web+'")';
					  
					  if(i%querysize == 0)
					  fs.writeSync(fd, valueset);
					  
					  if(i<len){
						  if(i%querysize == querysize-1){
						  fs.writeSync(fd, result+";\n");
						  }
						  else
						  {
						  fs.writeSync(fd, result+",\n");
						  }
					  }
						  else
						  fs.writeSync(fd, result+";");
				  }
				  done();
				}
			}
	}
   });

   // Load the plugin that provides tasks.
   grunt.loadNpmTasks('grunt-file-creator');
   grunt.loadNpmTasks('grunt-prompt');

   // Default tasks.
   grunt.registerTask('default', ['uglify']);
   
  grunt.registerTask('generate', ['prompt', 'file-creator:basic']);

};