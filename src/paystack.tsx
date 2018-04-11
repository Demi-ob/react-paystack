import * as React from 'react';
import * as paystack from 'paystack';

import './PayWithPaystack.css';

interface PayWithPaystackProps {
    embed?: boolean;
    text?: string;
    class?: string;
    metadata?: Object;
    currency?: string;
    plan?: string;
    quantity?: string;
    subaccount?: string;
    transaction_charge?: number;
    bearer?: string;
    // required fields
    reference: string;
    email: string;
    amount: number; // in kobo
    paystackkey: string;
    callback: Function;
    close: Function;
    disabled?: boolean;
}

interface PayWithPaystackState {
    text: string;
    class: string;
    metadata: Object;
    currency: string;
    plan: string;
    quantity: string;
    subaccount: string;
    transaction_charge: number;
    bearer: string;
    disabled: boolean;
}

class PayWithPaystack extends React.Component<PayWithPaystackProps, PayWithPaystackState> {
    constructor(props: PayWithPaystackProps) {
        super(props);
        this.state = {
            text: this.props.text || 'Make Payment',
            class: this.props.class || '',
            metadata: this.props.metadata || {},
            currency: this.props.currency || 'NGN',
            plan: this.props.plan || '',
            quantity: this.props.quantity || '',
            subaccount: this.props.subaccount || '',
            transaction_charge: this.props.transaction_charge || 0,
            bearer: this.props.bearer || '',
            disabled: this.props.disabled || false
        };
    }

    componentDidMount() {
        if (this.props.embed) {
            this.payWithPaystack();
        }
    }

    payWithPaystack = () => {
        let paystackOptions = {
            key: this.props.paystackkey,
            email: this.props.email,
            amount: this.props.amount,
            ref: this.props.reference,
            metadata: this.state.metadata,
            callback: (response) => {
                this.props.callback(response);
            },
            onClose: () => {
                this.props.close()
            },
            currency: this.state.currency,
            plan: this.state.plan,
            quantity: this.state.quantity,
            subaccount: this.state.subaccount,
            transaction_charge: this.state.transaction_charge,
            bearer: this.state.bearer,
        }
        if (this.props.embed) {
            paystackOptions['container'] = 'paystackEmbedContainer'
        }
        const handler = paystack.setup(paystackOptions);
        if (!this.props.embed) {
            handler.openIframe();
        }
    }

    render() {
        return this.props.embed ?
            (
                <div id='paystackEmbedContainer'></div>
            )
            :
            (
                <span>
                    <button className={this.state.class} onClick={this.payWithPaystack} disabled={this.state.disabled}>
                        {this.state.text}
                    </button>
                </span>
            )
    }
}


export default PayWithPaystack;
