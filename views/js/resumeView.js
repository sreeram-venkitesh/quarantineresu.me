var socials = document.getElementById('socials')
var projects = document.getElementById('projects')

const socialHideout = document.getElementById('socialHideout')
const projectHideout = document.getElementById('projectHideout')

var socialLinks = socialHideout.innerHTML
var projectLinks = projectHideout.innerHTML

console.log(socialLinks)
console.log(projectLinks)

socialLinks = JSON.parse(socialLinks)
projectLinks = JSON.parse(projectLinks)
console.log(socialLinks)
console.log(projectLinks)



for (var i=0; i<socialLinks.length; i++){
    var button = document.createElement('button')
    button.className='outline'
    button.type='button'
    button.style ="height:50px; margin-bottom:0px; overflow:visible; position:relative; font-weight:bold; margin-left:3px; margin-right:8px; font-size:larger"

    var social = document.createElement('a')
    var namess = document.createTextNode(socialLinks[i]['name'])

    social.appendChild(namess)
    social.href=socialLinks[i].link
    social.target='_blank'

    
    button.appendChild(social)

    socials.appendChild(button)
}


for( var j=0; j<projectLinks.length; j++){

    var project = document.createElement('div')
    project.className ='block fixed'
    project.style='display:inline-block; padding:30px;'

    var projectName = document.createElement('H4')
    projectName.className='title'
    projectName.style='margin-top:0px; margin-bottom:0px; font-weight:bold'
    var nameText = document.createTextNode(projectLinks[j]['name'])
    projectName.appendChild(nameText)

    if(projectLinks[j]['link']!=""){
        var cardLink = document.createElement('a')
        cardLink.className='title'
        cardLink.style='margin-top:0px; margin-bottom:0px;'
        var linkElement = document.createElement('H5')
        var linkText = document.createTextNode('Link to project')
        linkElement.className='title'
        linkElement.style='margin-top:0px; margin-bottom:0px;'
        linkElement.appendChild(linkText)
        cardLink.appendChild(linkElement)
        cardLink.href = projectLinks[j]['link']
        cardLink.target='_blank'
    }

    var description = document.createElement('H5')
    description.className='title'
    description.style='margin-top:0px; margin-bottom:0px;'
    var descriptionText = document.createTextNode(projectLinks[j].description)
    description.appendChild(descriptionText)
    
    var tag = document.createElement('H5')
    tag.className='title'
    tag.style='margin-top:0px; margin-bottom:0px; color:blue'
    var tagText = document.createTextNode(`Tags: ${projectLinks[j].tag}`)
    tag.appendChild(tagText)

    
    project.appendChild(projectName)
    if(projectLinks[j]['link']!=''){
        project.appendChild(cardLink)
    }
    project.appendChild(description)
    project.appendChild(tag)

    projects.appendChild(project)

}


var createButton = document.getElementById('createButton');
createButton.onclick = function() {
    console.log('clicked!')
    window.location = '/'
}
var shareButton = document.getElementById('shareButton');
shareButton.onclick = function(){
    var dummy = document.createElement('input'),
    text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    shareButton.innerHTML = 'Link Copied!';
    setTimeout(() =>shareButton.innerHTML="Share This Resume!",800);
}