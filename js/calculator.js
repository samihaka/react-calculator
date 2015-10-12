(function(){
	'use strict';

	/* Class for displaying entered numbers and result. */
	var Display = React.createClass({
		render: function(){
			return <h3 className="row display">{this.props.displayValue}</h3>
		}
	});

	/* Frame for calculator buttons. Buttons are disabled and enabled based on previous button that was pressed to ensure valid input. */
	var ButtonFrame = React.createClass({
		getInitialState: function(){
			return {
				numberDisabled: false,
				operatorDisabled: true,
				equalDisabled: true,
				decimalDisabled: false
			}
		},
		disableButtons: function(clickedNumber){
			this.setState({numberDisabled: false});
			this.setState({operatorDisabled: false});
			this.setState({equalDisabled: false});
			this.setState({decimalDisabled: false});

			if(this.props.isOperator(clickedNumber)){
				this.setState({operatorDisabled: true});	
				this.setState({equalDisabled: true});
			}

			if(this.props.isEqualSign(clickedNumber)){
				this.setState({numberDisabled: true});
				this.setState({equalDisabled: true});
				this.setState({decimalDisabled: true});
			}

			if(this.props.isDecimalSign(clickedNumber)){
				this.setState({operatorDisabled: true});
				this.setState({equalDisabled: true});
				this.setState({decimalDisabled: true});
			}
		},
		clickNumber: function(clickedNumber){
			console.log("clickNumber: "+clickedNumber);
			this.disableButtons(clickedNumber);

			this.props.handleInput(clickedNumber);
		},
		render: function(){
			return (
				<div>
					<div className="row">
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="1"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="2"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="3"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.operatorDisabled} value="/"/>
					</div>
					<div className="row">
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="4"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="5"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="6"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.operatorDisabled} value="*"/>
					</div>
					<div className="row">
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="7"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="8"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="9"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.operatorDisabled} value="+"/>
					</div>
					<div className="row">
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.decimalDisabled} value="."/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.numberDisabled} value="0"/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.equalDisabled} value="="/>
						<NumberButton clickNumber={this.clickNumber} disabled={this.state.operatorDisabled} value="-"/>
					</div>
				</div>
			)
		}
	});

	/* Class for calculator button */
	var NumberButton = React.createClass({
		render: function(){
			var clickNumber = this.props.clickNumber;

			return <button className="btn btn-default btn-lg" onClick={this.handleClick} disabled={this.props.disabled}>{this.props.value}</button>	
		},
		handleClick: function(){
			console.log("handleClick: "+this.props.value);
			this.props.clickNumber(this.props.value);
		}
	});

	/* Main class, that renders the calculator, stores and handles input and calculates results */
	var Calculator = React.createClass({
		getInitialState: function(){
			return {
				displayValue: "0",
				selections: [],
				currentNumber: null
			}
		},
		handleInput: function(clickedNumber){
			console.log("clickedNumber: "+clickedNumber);

			if(this.isNumber(clickedNumber)){
				console.log("HandleInput: is number");
				if(this.state.currentNumber == null){
					this.state.currentNumber = clickedNumber;
				}
				else {
					if(!this.isOperator(clickedNumber)){
						this.state.currentNumber += clickedNumber;
					}
				}
			}

			if(this.isEqualSign(clickedNumber)){
				console.log("HandleInput: equal");

				this.state.selections.push(this.state.currentNumber);
				this.setState({currentNumber: null});

				this.calculateTotal();
			}

			if(this.isOperator(clickedNumber)){
				console.log("HandleInput: operator");

				if(this.state.currentNumber != null){
					this.state.selections.push(this.state.currentNumber);
					this.setState({currentNumber: null});
				}

				this.state.selections.push(clickedNumber);
			}

			if(this.isDecimalSign(clickedNumber) && this.state.currentNumber == null){
				console.log("HandleInput: decimal sign");
				clickedNumber = "0"+clickedNumber;
				this.state.currentNumber = clickedNumber;
			}

			console.log("currentNumber: "+this.state.currentNumber);
			console.log("selections: "+this.state.selections);

			this.updateDisplay(clickedNumber);
		},
		isNumber: function(clickedNumber){
			if(clickedNumber >= 0 && clickedNumber <= 9){
				return true;
			}
			else{
				return false;
			}
		},
		isOperator: function(clickedNumber){
			if(clickedNumber == "+" ||
			   clickedNumber == "-" ||
			   clickedNumber == "/" ||
			   clickedNumber == "*"){
				return true;
			}
			else{
				return false;
			}
		},
		isEqualSign: function(clickedNumber){
			return clickedNumber == "=" ? true: false;
		},
		isDecimalSign: function(clickedNumber){
			return clickedNumber == "." ? true: false;
		},
		calculateTotal: function(){
			var operand1 = null,
				operand2 = null,
				operator = null;

			console.log("selections before calculation: "+this.state.selections);
			for(var i = 0; i < this.state.selections.length; i++){
				if(!this.isOperator(this.state.selections[i])){
					if(operand1 == null){
						operand1 = this.state.selections[i];
					}
					else{
						operand2 = this.state.selections[i];
						operand1 = this.makeCalculation(operand1, operand2, operator);
						this.setState({displayValue: operand1});
					}
				}
				else{
					operator = this.state.selections[i];
				}
			} 

			this.state.selections = [];
			console.log("selections after calculation: "+this.state.selections);
			this.state.selections.push(operand1);
		},
		makeCalculation: function(operand1, operand2, operator){
			switch(operator){
				case "+":
					return Number(operand1) + Number(operand2);
				case "-":
					return operand1 - operand2;
				case "/":
					return operand1 / operand2;
				case "*":
					return operand1 * operand2;
			}
		},
		updateDisplay: function(clickedNumber){
			if(!this.isEqualSign(clickedNumber)){
				if(this.state.displayValue == "0"){
					this.setState({displayValue: clickedNumber});				
				}
				else{
					this.setState({displayValue: this.state.displayValue += clickedNumber});
				}
			}
		},
		render: function(){
			return (
				<div>
					<Display displayValue = {this.state.displayValue}/>
					<ButtonFrame handleInput={this.handleInput} isNumber={this.isNumber} isOperator={this.isOperator} isEqualSign={this.isEqualSign} isDecimalSign={this.isDecimalSign}/>
				</div>
			)
		}
	});

	React.render(<Calculator />, document.getElementById('root'));
})();