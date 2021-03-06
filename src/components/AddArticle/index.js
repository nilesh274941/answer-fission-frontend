import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TagInput from './../TagInput';
import LinkInput from './../LinkInput';
import Modal from 'react-bootstrap/Modal';
import suggestions from './../../suggestions';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';

class Article {
	constructor() {
		this.title="";
		this.description="";
		this.tags=[];		
		this.resourceLinks=[];
	}
}

class AddArticle extends Component {
	constructor(props) {
		super(props);
		this.initialState={
			title: "",
			description: "",
			tags:[],
			resourceLinks:[],
			titleError: "",
			descriptionError: "",
			tagsError: "",
			resourceLinksError: "",
			suggestions,
			showPreview: false
		}
		this.state=this.initialState;
		this.onTagAddHandler=(tag)=>{
			const tags=[...this.state.tags];
			const suggestions=[...this.state.suggestions]
			suggestions.splice(suggestions.indexOf(tag),1);
			tags.push(tag);
			this.setState({tags,tagsError: "", suggestions});
		}
		this.onTagRemoveHandler=(index)=>{
			const tags=[...this.state.tags];
			const tag=tags[index];
			const suggestions=[...this.state.suggestions];
			suggestions.push(tag);
			tags.splice(index,1);
			this.setState({tags, suggestions});			
		}
		this.onResourceLinkAddHandler=(link)=>{
			const resourceLinks=[...this.state.resourceLinks];
			resourceLinks.push(link);
			this.setState({resourceLinks, resourceLinksError: ""});
		}
		this.onResourceLinkRemoveHandler=(index)=>{
			const resourceLinks=[...this.state.resourceLinks];
			resourceLinks.splice(index,1);
			this.setState({resourceLinks});
		}
		this.verifyData=(article)=>{
			let valid=true;
			if(article.title.trim().length===0) {
				this.setState({
					titleError: "Title required."
				});
				valid=false;
			}
			if(article.description.length===0) {
				this.setState({
					descriptionError: "Description required."
				});
				valid=false;
			}
			if(article.tags.length===0) {
				this.setState({
					tagsError: "Please add at least one tag."
				});
				valid=false;				
			}
			return valid;
		}
		this.previewClickHandler=(evt)=>{
			const article=new Article();
			article.title=this.state.title;
			article.description=this.state.description;
			article.tags=this.state.tags;
			article.resourceLinks=this.state.resourceLinks;
			const valid=this.verifyData(article);
			if(!valid) return;
			this.setState({showPreview: true});
			// Style the preview properly
		}
		this.postClickHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					const article=new Article();
					article.title=this.state.title;
					article.description=this.state.description;
					article.tags=this.state.tags;
					article.resourceLinks=this.state.resourceLinks;
					const valid=this.verifyData(article);
					if(!valid) return;			
					fetch("http://localhost:8888/postArticle",{
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify(article),
						credentials: "include"
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("success");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);							
							this.setState(this.initialState);
						}
						else {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("error");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						}
					});					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);
				}
				
			});
			
		}
	}
	componentDidUpdate() {
	}
	render() {
		return (
			<div className="add-article">
				<h4 className="page-title">
					<span>Add An Article</span>
				</h4>
				<form>
					<div className="input-label">Title</div>
					<div className="input-description">
						Give a suitable title to your Article
						{
							(this.state.titleError.length>0)?
							<label className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>
								{this.state.titleError}
							</label>
							:null
						}
					</div>
					<input type="text" className="title-input form-control" id="add-article-title-input" placeholder="eg: Arrays in JavaScript" value={this.state.title} onChange={(evt)=>{this.setState({title: evt.target.value, titleError: ""})}} /> 
					
					<div className="input-label">Description</div>
					<div className="input-description">
						Provide a good description for learners
						{
							(this.state.descriptionError.length>0)?
							<label  className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>							
								{this.state.descriptionError}
							</label>
							:null
						}
					</div>
					<CKEditor
						editor={ ClassicEditor }
						data={this.state.description}
						config={{         
						  toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', 'blockQuote', 'link', 'imageUpload', '|', 'insertTable',
							'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo'],
						  ckfinder: {
							  uploadUrl: "http://localhost:8888/imageUpload/article",
						  }
							
						}}     				
						onReady={ (editor) => {
						} }
						onChange={ ( event, editor ) => {
							const data = editor.getData();
							this.setState({
								description: data,
								descriptionError: ""
							});
						} }
					/>

					<div className="input-label">Tags</div>
					<div className="input-description">
						Add some relatable tags
						{
							(this.state.tagsError.length>0)?
							<label  className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>
								{this.state.tagsError}
							</label>
							:null
						}
					</div>
					<TagInput
						tags={this.state.tags}
						suggestions={this.state.suggestions}
						onAdd={this.onTagAddHandler}
						onRemove={this.onTagRemoveHandler}
						placeholder="eg: JavaScript"
					/>

					<div className="input-label">Resource Links</div>
					<div className="input-description">
						Add important links related to the article (Optional)
						{
							(this.state.resourceLinksError.length>0)?
							<label  className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>
								{this.state.resourceLinksError}
							</label>
							:null
						}
					</div>
					<LinkInput
						links={this.state.resourceLinks}
						onAdd={this.onResourceLinkAddHandler}
						onRemove={this.onResourceLinkRemoveHandler}
						placeholder="eg: https://geeksforgeeks.com/js/arrays"
					/>


					<div>
						<button type="button" className="btn btn-dark button" onClick={this.previewClickHandler}>Preview</button>
						<button type="button" className="post-button add-article-button button btn" onClick={this.postClickHandler}>Submit Your Article</button>
					</div>
				</form>
				<Modal
					size="lg"
					centered
					show={this.state.showPreview}
					onHide={(evt)=>{this.setState({showPreview: false})}}
				>
					<Modal.Header style={{color: "rgb(34, 64, 153)"}}>
						<Modal.Title>Article Preview</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4 className="preview-article-title">{this.state.title}</h4>
						<div className="preview-article-description" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
						<div className="preview-article-tags">{this.state.tags}</div>
						<div className="preview-article-resourceLinks">{this.state.resourceLinks}hi</div>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-dark" onClick={(evt)=>{this.setState({showPreview: false})}}>OK</button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(AddArticle);