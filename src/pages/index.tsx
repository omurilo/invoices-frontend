import React, { useState } from "react";
import {
  MenuItem,
  Typography,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
} from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import { CreditCard, Invoice } from "../models";
import api from "../services";
import { useEffect } from "react";
import axios from "axios";
import useSWR from "swr";

type InvoicesListPageProps = {
  creditCards: CreditCard[];
};

const fetcher = (resource: string) => api.get(resource).then((res) => res.data);

const InvoicesListPage = ({ creditCards }: InvoicesListPageProps) => {
  const [creditCardNumber, setCreditCardNumber] = useState(
    creditCards.length ? creditCards[0].number : ""
  );

  const { data: invoices } = useSWR<Invoice[]>(
    `credit-cards/${creditCardNumber}/invoices`,
    fetcher,
    {
      refreshInterval: 5000,
      refreshWhenHidden: false,
    }
  );

  const handleChangeCCNumber = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setCreditCardNumber(event.target.value as string);
  };

  if (!creditCards.length) {
    return (
      <div>
        <Head>
          <title>Fatura - Nenhum cartão encontrado</title>
        </Head>
        <Typography component="h1" variant="h3" color="textPrimary">
          Não existe nenhum cartão cadastro
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Fatura - #{creditCardNumber}</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Fatura
      </Typography>
      <Select
        label="Cartão de crédito"
        defaultValue={creditCards[0].number}
        value={creditCardNumber}
        onChange={handleChangeCCNumber}
      >
        {creditCards.map((card) => (
          <MenuItem key={card.number} value={card.number}>
            {card.number}
          </MenuItem>
        ))}
      </Select>
      <Grid container>
        <Grid item xs={12} md={3}>
          <List>
            {invoices?.map((invoice) => (
              <ListItem key={invoice.id} alignItems="flex-start">
                <ListItemText
                  primary={format(parseISO(invoice.payment_date), "dd/MM/yyyy")}
                  secondary={invoice.store}
                />
                <ListItemSecondaryAction>
                  R$ {invoice.amount}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default InvoicesListPage;

export const getStaticProps: GetStaticProps<InvoicesListPageProps> =
  async () => {
    try {
      const { data: creditCards } = await api.get("credit-cards");

      return {
        props: {
          creditCards,
        },
        revalidate: 1 * 60,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { notFound: true };
      }
      throw error;
    }
  };
