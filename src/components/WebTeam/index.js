import React, { Component } from 'react';
import './styles.css';
import PhotoNileshPatidar from './../../images/PhotoNileshPatidar.jpg';

export default class WebTeam extends Component {
	constructor(props){
		super(props);
	}
	render() {
		return (
			<div className="web-team-container">
				<div className="web-team-wrapper">
					<div className="member-container">
						<img className="member-photo" alt="Photo" src={PhotoNileshPatidar}/>
						<div className="member-name">Nilesh Patidar</div>
						<div className="status">
							<span className="field">Role</span> | Backend and Frontend Developer <br/>
						</div>
							<hr/>
						<div className="contacts">
							<a href="https://www.linkedin.com/in/nilesh-patidar-a48b7b1b2" target="_blank">
								<i className="fa fa-linkedin-square contact-icon"></i>
							</a>
							<a href="https://www.instagram.com/nileshhh__/" target="_blank">
								<i className="fa fa-instagram contact-icon"></i>
							</a>
							<a href="https://www.facebook.com/nilesh.patidar.7568" target="_blank">
								<i className="fa fa-facebook-official contact-icon"></i>
							</a>
							<a href="https://twitter.com/d009d4ab58524c5" target="_blank">
								<i className="fa fa-twitter contact-icon"></i>
							</a>
							<br/>
							<br/>
							<div style={{textAlign: "left"}}>
							<i className="fa fa-envelope "></i>  nileshpatidar874@gmail.com
							<br/>
							<i className="fa fa-phone "></i>  +91 | 9039824590
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}