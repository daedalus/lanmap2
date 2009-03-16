/* ex: set ts=4 noet: */

#include <sys/types.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "getopt.h"

int optind=1, opterr=1, optopt=0;
char *optarg=0;

/* this is the plain old UNIX getopt, with GNU-style extensions. */
/* if you're porting some piece of UNIX software, this is all you need. */
/* this supports GNU-style permution and optional arguments */

int getopt(int argc, char * argv[], const char *opts)
{
	static int charind=0;
	const char *s;
	char mode, colon_mode;
	int off = 0, opt = -1;

	if(getenv("POSIXLY_CORRECT")) colon_mode = mode = '+';
	else {
		if((colon_mode = *opts) == ':') off ++;
		if(((mode = opts[off]) == '+') || (mode == '-')) {
			off++;
			if((colon_mode != ':') && ((colon_mode = opts[off]) == ':'))
				off ++;
		}
	}
	optarg = 0;
	if(charind) {
		optopt = argv[optind][charind];
		for(s=opts+off; *s; s++) if(optopt == *s) {
			charind++;
			if((*(++s) == ':') || ((optopt == 'W') && (*s == ';'))) {
				if(argv[optind][charind]) {
					optarg = &(argv[optind++][charind]);
					charind = 0;
				} else if(*(++s) != ':') {
					charind = 0;
					if(++optind >= argc) {
						if(opterr) fprintf(stderr, "%s: option requires an argument -- %c\n",
																argv[0], optopt);
						opt = (colon_mode == ':') ? ':' : '?';
						goto my_getopt_ok;
					}
					optarg = argv[optind++];
				}
			}
			opt = optopt;
			goto my_getopt_ok;
		}
		if(opterr) fprintf(stderr, "%s: illegal option -- %c\n",
												argv[0], optopt);
		opt = '?';
		if(argv[optind][++charind] == '\0') {
			optind++;
			charind = 0;
		}
	my_getopt_ok:
		if(charind && ! argv[optind][charind]) {
			optind++;
			charind = 0;
		}
	} else if((optind >= argc) ||
						 ((argv[optind][0] == '-') &&
							(argv[optind][1] == '-') &&
							(argv[optind][2] == '\0'))) {
		optind++;
		opt = -1;
	} else if((argv[optind][0] != '-') ||
						 (argv[optind][1] == '\0')) {
		char *tmp;
		int i, j, k;

		if(mode == '+') opt = -1;
		else if(mode == '-') {
			optarg = argv[optind++];
			charind = 0;
			opt = 1;
		} else {
			for(i=j=optind; i<argc; i++) if((argv[i][0] == '-') &&
																				(argv[i][1] != '\0')) {
				optind=i;
				opt=getopt(argc, argv, opts);
				while(i > j) {
					tmp=argv[--i];
					for(k=i; k+1<optind; k++) argv[k]=argv[k+1];
					argv[--optind]=tmp;
				}
				break;
			}
			if(i == argc) opt = -1;
		}
	} else {
		charind++;
		opt = getopt(argc, argv, opts);
	}
	if (optind > argc) optind = argc;
	return opt;
}


int _getopt_internal(int argc, char * argv[], const char *shortopts,
const struct option *longopts, int *longind, int long_only)
{
	char mode, colon_mode = *shortopts;
	int shortoff = 0, opt = -1;

	if(getenv("POSIXLY_CORRECT")) colon_mode = mode = '+';
	else {
		if((colon_mode = *shortopts) == ':') shortoff ++;
		if(((mode = shortopts[shortoff]) == '+') || (mode == '-')) {
			shortoff++;
			if((colon_mode != ':') && ((colon_mode = shortopts[shortoff]) == ':'))
				shortoff ++;
		}
	}
	optarg = 0;
	if((optind >= argc) ||
			((argv[optind][0] == '-') &&
			 (argv[optind][1] == '-') &&
			 (argv[optind][2] == '\0'))) {
		optind++;
		opt = -1;
	} else if((argv[optind][0] != '-') ||
						(argv[optind][1] == '\0')) {
		char *tmp;
		int i, j, k;

		opt = -1;
		if(mode == '+') return -1;
		else if(mode == '-') {
			optarg = argv[optind++];
			return 1;
		}
		for(i=j=optind; i<argc; i++) if((argv[i][0] == '-') &&
																		(argv[i][1] != '\0')) {
			optind=i;
			opt=_getopt_internal(argc, argv, shortopts,
															longopts, longind,
															long_only);
			while(i > j) {
				tmp=argv[--i];
				for(k=i; k+1<optind; k++)
					argv[k]=argv[k+1];
				argv[--optind]=tmp;
			}
			break;
		}
	} else if((!long_only) && (argv[optind][1] != '-'))
		opt = getopt(argc, argv, shortopts);
	else {
		int charind, offset;
		int found = 0, ind, hits = 0;

		if(((optopt = argv[optind][1]) != '-') && ! argv[optind][2]) {
			int c;
			
			ind = shortoff;
			while((c = shortopts[ind++])) {
				if(((shortopts[ind] == ':') ||
						((c == 'W') && (shortopts[ind] == ';'))) &&
					 (shortopts[++ind] == ':'))
					ind ++;
				if(optopt == c) return getopt(argc, argv, shortopts);
			}
		}
		offset = 2 - (argv[optind][1] != '-');
		for(charind = offset;
				(argv[optind][charind] != '\0') &&
					(argv[optind][charind] != '=');
				charind++);
		for(ind = 0; longopts[ind].name && !hits; ind++)
			if((strlen(longopts[ind].name) == (size_t) (charind - offset)) &&
				 (strncmp(longopts[ind].name,
									argv[optind] + offset, charind - offset) == 0))
				found = ind, hits++;
		if(!hits) for(ind = 0; longopts[ind].name; ind++)
			if(strncmp(longopts[ind].name,
								 argv[optind] + offset, charind - offset) == 0)
				found = ind, hits++;
		if(hits == 1) {
			opt = 0;

			if(argv[optind][charind] == '=') {
				if(longopts[found].has_arg == 0) {
					opt = '?';
					if(opterr) fprintf(stderr, "%s: option `--%s' doesn't allow an argument\n",
														 argv[0], longopts[found].name);
				} else {
					optarg = argv[optind] + ++charind;
					charind = 0;
				}
			} else if(longopts[found].has_arg == 1) {
				if(++optind >= argc) {
					opt = (colon_mode == ':') ? ':' : '?';
					if(opterr) fprintf(stderr, "%s: option `--%s' requires an argument\n",
														 argv[0], longopts[found].name);
				} else optarg = argv[optind];
			}
			if(!opt) {
				if (longind) *longind = found;
				if(!longopts[found].flag) opt = longopts[found].val;
				else *(longopts[found].flag) = longopts[found].val;
			}
			optind++;
		} else if(!hits) {
			if(offset == 1) opt = getopt(argc, argv, shortopts);
			else {
				opt = '?';
				if(opterr) fprintf(stderr, "%s: unrecognized option `%s'\n",
													 argv[0], argv[optind++]);
			}
		} else {
			opt = '?';
			if(opterr) fprintf(stderr, "%s: option `%s' is ambiguous\n",
												 argv[0], argv[optind++]);
		}
	}
	if (optind > argc) optind = argc;
	return opt;
}

