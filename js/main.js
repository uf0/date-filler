$(document).ready(function(){
  var data,
      keys;

  $('#parse').click(function(){
    parse();
  })

  $('#go').click(function(){
    go();
  })

  function parse(){
    var rawdata = $('#rawdata').val();
    data = d3.tsvParse(rawdata);
    if(data.length){
      keys = d3.keys(data[0])
      addHeaders(keys)
    }
  }

  function addHeaders(headers){
//     <label>
//   <input type="checkbox"> Check me out
// </label><div class="checkbox">
    var c1 = d3.select('#headers').selectAll('div').data(headers).enter()
      .append('div')
      .attr('class', 'checkbox')

      c1.append('input')
      .attr('type', 'checkbox')
      .attr('id', function(d){
        return d
      })
      .attr('value', function(d){
        return d
      })

      c1.append('label')
      .text(function(d){
        return d
      })


      var c2 = d3.select('#group').selectAll('label').data(headers).enter()
      .append('div')
      .attr('class', 'checkbox')


        c2.append('input')
        .attr('type', 'checkbox')
        .attr('id', function(d){
          return d
        })
        .attr('value', function(d){
          return d
        })


          c2.append('label')
          .text(function(d){
            return d
          })

        var c3 = d3.select('#value').selectAll('label').data(headers).enter()
        .append('div')
        .attr('class', 'checkbox')
        
          c3.append('input')
          .attr('type', 'checkbox')
          .attr('id', function(d){
            return d
          })
          .attr('value', function(d){
            return d
          })

          c3.append('label')
          .text(function(d){
            return d
          })

  }

  function go(){
    var datecolumn;
    d3.select('#headers').selectAll('input:checked').each(function(d){
      datecolumn = d3.select(this).node().value
    })

    var groupcolumn;
    d3.select('#group').selectAll('input:checked').each(function(d){
      groupcolumn = d3.select(this).node().value
    })

    var valuecolumn;
    d3.select('#value').selectAll('input:checked').each(function(d){
      valuecolumn = d3.select(this).node().value
    })

    var aggregation;
    d3.select('#aggregation').selectAll('input:checked').each(function(d){
      aggregation = d3.select(this).node().value
    })

    if(groupcolumn){
      var nested = d3.nest().key(function(d){return d[groupcolumn]}).entries(data)

      nested.forEach(function(group){

      var dateExtent = d3.extent(group.values, function(d){
        return new Date(d[datecolumn])
      })
      var intervals;
      var format;
      if(aggregation == 'year'){
        intervals = d3.timeYear.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y")
      }else if(aggregation == 'month'){
        intervals = d3.timeMonth.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y-%m")
      }else{
        intervals = d3.timeDay.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y-%m-%d")
      }

     intervals.forEach(function(d,i){
         var elm = group.values.filter(function(e){
           var date = format(new Date(e[datecolumn]))
           return date === format(d);
         });

         if(!elm.length){

           var add = {}
           keys.forEach(function(key){
             add[key] = undefined;
           })
           add[datecolumn] = format(d);
           add.date_to_use = format(d);
           add[groupcolumn] = group.key;
           add[valuecolumn] = 0;
           group.values.push(add)
         }
       })

       group.values.forEach(function(d){
         if(!d.date_to_use){
           d.date_to_use = format(new Date(d[datecolumn]))
         }
       })

       group.values.sort(function(a,b){return d3.ascending(a.date_to_use,b.date_to_use)})

      })
      var output = d3.merge(nested.map(function(d){
        return d.values
      }))

      $('#output').val(d3.tsvFormat(output))
    }else{

      var dateExtent = d3.extent(data, function(d){
        return new Date(d[datecolumn])
      })
      var intervals;
      var format;
      if(aggregation == 'year'){
        intervals = d3.timeYear.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y")
      }else if(aggregation == 'month'){
        intervals = d3.timeMonth.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y-%m")
      }else{
        intervals = d3.timeDay.range(dateExtent[0], dateExtent[1]);
        format = d3.timeFormat("%Y-%m-%d")
      }

     intervals.forEach(function(d,i){
         var elm = data.filter(function(e){
           var date = format(new Date(e[datecolumn]))
           return date === format(d);
         });

         if(!elm.length){

           var add = {}
           keys.forEach(function(key){
             add[key] = undefined;
           })
           add[datecolumn] = format(d);
           add.date_to_use = format(d);
           add[valuecolumn] = 0;
           data.push(add)
         }
       })

       data.forEach(function(d){
         if(!d.date_to_use){
           d.date_to_use = format(new Date(d[datecolumn]))
         }
       })

       data.sort(function(a,b){return d3.ascending(a.date_to_use,b.date_to_use)})
       $('#output').val(d3.tsvFormat(data))
    }

  }

})
