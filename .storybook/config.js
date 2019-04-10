import { configure, addDecorator } from '@storybook/angular';


const storyAsString = (story) => `<div class="theme-wrapper default-theme">${story}</div>`;
const storyAsNode = (story) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-wrapper default-theme';
    wrapper.appendChild(story);
    return wrapper;
};

addDecorator(story => {
  const tale = story();
    if(typeof tale === "string")
    {
	return  storyAsString(tale);
    }
    else if(typeof tale === "node")
    {
	return storyAsNode(tale);
    }
    else if (tale && tale.template)
    {
	tale.template = storyAsString(tale.template);
 	console.log("adding div tag", tale);
	return tale;
    }
    else
    {
	
	console.log(tale);
	return tale;
    }
});

// automatically import all files ending in *.stories.ts
const req = require.context('../src/', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
 
