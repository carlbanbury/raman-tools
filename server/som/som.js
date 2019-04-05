import _ from 'lodash/fp';

Meteor.methods({
    'SOM:delete': function(id) {
        var result = SOM.remove({uid: Meteor.userId(), _id: id});
    },
    'SOM:compute': function(projectId, props) {
        console.log('New call to build SOM');
        var somID = SOM.insert({
            status: 0,
            // _id: somID,
            uid: Meteor.userId(),
            projectId: projectId,
            gridSize: props.gridSize,
            created_at: new Date(),
            description: props.description
        });
        console.log(somID)
        Jobs.run("buildSOM", projectId, props, somID, Meteor.userId(), {singular: true});
    },
    'SOM:getModel': function(somId, projectId) {
      var project = Projects.findOne({_id: projectId});
      var som = SOM.findOne({_id: somId});
      som.model.labelEnum.map((item)=>{
          var match = project.labels.filter((label)=>{
            return label.tag === item.tag;
          })

          if (match && match[0]) {
            item.color = match[0].color;
          }
      })
      return som;
    },
    'SOM:getX': function(projectId) {
      return Spectra.findOne({projectId: projectId}, {x: 1}).x
    }
})
