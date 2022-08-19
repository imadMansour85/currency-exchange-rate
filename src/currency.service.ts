import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyPair } from './createPair.dto';
import { CurrencyPair } from './CurrencyPair.entity';
import { exchangeBodyDto } from './exchangeBody.dto';
import { PathItem } from './interfaces/path';
import { Response } from './interfaces/response';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CurrencyPair) private readonly currencyRepository: Repository<CurrencyPair>,
  ) { }

  //BFS algorithme shortest path
  shortestPathBfs(graph, from, to): Array<PathItem> {
    try {

      let queue = [[(from), []]],
        seen = new Set;
      let path;
      while (queue.length) {
        //init queue BFS
        let [vertex, [...path], rate] = queue.shift();

        //init if undifined the rate for the first currency in the path
        rate = rate ? rate : 1
        path.push({ vertex, rate });

        //return path if we finish reading queue
        if (vertex === to) {
          console.log(path);

          return path
        };
        if (!seen.has(vertex) && graph[vertex]) {

          queue.push(...graph[vertex].map(v => {
            //return destination currency with exchange rate
            return [v.to, path, v.rate]
          }));

        }
        seen.add(vertex);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //add from-to currency pair
  async addPair(createCurrencyPair: CreateCurrencyPair): Promise<Response> {
    try {

      let newPair;

      let pair = await this.currencyRepository.findOne({
        where: [{ from: createCurrencyPair.from, to: createCurrencyPair.to }, { from: createCurrencyPair.to, to: createCurrencyPair.from }]
      })

      //update or create if not found a pair Currency
      if (!pair) {
        newPair = await this.currencyRepository.create(createCurrencyPair);
        await this.currencyRepository.save(newPair);
        return { success: true, message: "pair created successfuly!" }
      }
      else {
        pair.from = createCurrencyPair.from
        pair.to = createCurrencyPair.to
        pair.rate = createCurrencyPair.rate

        await this.currencyRepository.save(pair);
        return { success: true, message: "pair updated successfuly!" }
      }

    } catch (error) {
      console.log(error.message);
      return { success: false, message: error.message }

    }
  }


  async convert(exchangeBodyDto: exchangeBodyDto): Promise<Response> {
    try {
      let { from, to, amount } = exchangeBodyDto
      //get all currencyPairs with distinct to create graph easily
      let allCurrencies = await this.currencyRepository.createQueryBuilder('currency')
        .distinct(true)
        .select(['currency.from', 'currency.to', 'currency.rate'])
        .getRawMany();

      //graph creation  syntax {"EUR":["USD","CAD"]}
      let graph = allCurrencies.reduce((r, pair) => {
        r[pair.currency_from] = r[pair.currency_from] || [];
        r[pair.currency_to] = r[pair.currency_to] || [];
        r[pair.currency_from].push({ to: pair.currency_to, rate: pair.currency_rate });
        r[pair.currency_to].push({ to: pair.currency_from, rate: 1 / pair.currency_rate });
        return r;
      }, Object.create(null));



      if (this.shortestPathBfs(graph, from, to)) {

        let path = this.shortestPathBfs(graph, from, to)
        let exchangeRate = amount || 1

        //calculate the exchangeRate after looping the shortest path
        path.forEach(elm => {
          exchangeRate = elm.rate / exchangeRate
        });

        return { success: true, message: "get exchange rate successfully", data: exchangeRate }
      }
      else {
        return { success: false, message: "No data available" }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}
