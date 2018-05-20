import * as React from 'react';

interface State {
    imageUrl:string
}

export class ImageLoader extends React.Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = { imageUrl: "" };
    }

    public onImageLoad = (event:any) => {
        const uploadedFile:File = event.target.files[0];
        const reader:FileReader  = new FileReader();
        reader.readAsDataURL(uploadedFile);

        reader.onload = () => {

            console.log(reader.result);
            
            this.setState({
                imageUrl: reader.result
            })
        }
    }

    public render() {

        return(
            <div className="ImageLoader">
                <input type="file" onChange={this.onImageLoad}/>
                <img src={this.state.imageUrl} />
            </div>
        )
    }
}