import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './Footer.scss'

function Footer() {
    return (
        <footer>
            <div>
                <ul>
                    <li>Made by Nek</li>
                    <li>2019</li>
                    <li className='social-icon'>
                        <a href='https://github.com/Nektario/movies' target='_blank' rel='noopener noreferrer'>
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <ul>
                    <li>React</li>
                    <li>Javascript</li>
                    <li>react-spring</li>
                    <li>Firebase</li>
                    <li>TMDB</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer